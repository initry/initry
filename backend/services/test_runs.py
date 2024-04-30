import datetime

import pymongo
from pymongo.collection import Collection

from services.main import AppService
from services.tests import TestsService
from storage import st
from tasks import xml_related
from ws.ws import wsm

PYTEST_EMPTY_SYSTEM_OUT = "--------------------------------- Captured Log ---------------------------------\n\n--------------------------------- Captured Out ---------------------------------"
PYTEST_EMPTY_SYSTEM_ERROR = (
    "--------------------------------- Captured Err ---------------------------------"
)


class TestRunsService(AppService):
    def __init__(self):
        super().__init__()
        self.collection: Collection = self.mongo.db["test_runs"]

    def find_last_test_run(self):
        return self.mongo.find_one_sorted(
            sort_criteria=[("_id", pymongo.DESCENDING)],
            collection_name=self.collection.name,
        )

    def get_latest_test_runs(self, limit: int):
        latest_test_runs = self.mongo.find_sorted_limited(
            sort_criteria=[("startedAt", pymongo.DESCENDING)],
            limit=limit,
            collection_name=self.collection.name,
        )
        latest_test_runs_list = list(latest_test_runs)
        for tr in latest_test_runs_list:
            if "stoppedAt" not in tr:
                storage_tr = st.get_test_run(tr["uuid"])
                item = {
                    "uuid": storage_tr["uuid"],
                    "failed": storage_tr["failed"] if "failed" in storage_tr else 0,
                    "passed": storage_tr["passed"] if "passed" in storage_tr else 0,
                    "skipped": storage_tr["skipped"] if "skipped" in storage_tr else 0,
                }
                wsm.add(message={"type": "test_run", **item}, channel="live")
        return latest_test_runs_list

    def get_test_run_by_id(self, test_run_id):
        db_data = self.mongo.find_one_by_key_value(
            key="uuid", value=test_run_id, collection_name=self.collection.name
        )
        storage_tr = st.get_test_run(test_run_uuid=test_run_id)
        if storage_tr:
            item = {
                "uuid": storage_tr["uuid"],
                "failed": storage_tr["failed"] if "failed" in storage_tr else 0,
                "passed": storage_tr["passed"] if "passed" in storage_tr else 0,
                "skipped": storage_tr["skipped"] if "skipped" in storage_tr else 0,
            }
            wsm.add(
                message={"type": "test_run", **item}, channel=f"test-run/{test_run_id}"
            )
        return db_data

    def generate_run_id(self):
        today_date = datetime.date.today()
        last_test_run = self.find_last_test_run()
        if last_test_run is None:
            return f"#{today_date.strftime('%Y%m%d')}.1"
        if "runName" in last_test_run:
            last_date_str = last_test_run["runName"][1:].split(".")[0]
        else:
            return f"#{today_date.strftime('%Y%m%d')}.1"
        last_date = datetime.datetime.strptime(last_date_str, "%Y%m%d").date()
        if today_date == last_date:
            run_number = int(last_test_run["runName"].split(".")[1]) + 1
        else:
            run_number = 1
        new_run_name = f"#{today_date.strftime('%Y%m%d')}.{run_number}"
        return new_run_name

    def modify_test_run(self, data, test_run_uuid):
        self.mongo.modify_object(
            find={"uuid": test_run_uuid}, update={**data}, collection_name="test_runs"
        )

    def convert_date(self, original_timestamp, added_seconds=None):
        timestamp_parts = original_timestamp.split(".")
        original_datetime = datetime.datetime.strptime(
            timestamp_parts[0], "%Y-%m-%dT%H:%M:%S"
        )
        milliseconds = int(timestamp_parts[1]) / 1000
        original_datetime += datetime.timedelta(milliseconds=milliseconds)
        if added_seconds:
            original_datetime += datetime.timedelta(seconds=float(added_seconds))
        utc_datetime = original_datetime.astimezone(datetime.timezone.utc)
        return utc_datetime.strftime("%Y-%m-%dT%H:%M:%SZ")

    def xml_modify_test_run(self, xml, test_run_uuid):
        try:
            testsuite = xml["testsuites"]["testsuite"]
            test_run = {
                "startedAt": self.convert_date(testsuite["@timestamp"]),
                "testsCount": int(testsuite["@tests"]),
                "passed": (
                    int(testsuite["@tests"])
                    - int(testsuite["@skipped"])
                    - int(testsuite["@failures"])
                    - int(testsuite["@errors"])
                ),
                "failed": int(testsuite["@failures"]),
                "skipped": int(testsuite["@skipped"]),
                "testSuite": testsuite["@name"],
                "hostName": testsuite["@hostname"],
                # data["testsuites"]["testsuite"]["@errors"]
            }

            xml_related.create_db_data_based_on_xml.delay(test_run_uuid, test_run)

        except Exception as e:
            print(e)

    def xml_status(self, t):
        if ("failure" not in t) and ("skipped" not in t):
            return "PASSED"
        if "failure" in t:
            return "FAILED"
        if "skipped":
            return "SKIPPED"

    def xml_get_raw_test_run(self, test_run_uuid):
        return self.mongo.count_documents_in_collection(
            {"uuid": test_run_uuid}, "test_runs_raw"
        )

    def xml_create_tests(self, json_data, test_run_uuid):
        try:
            tests_for_db = []
            failures_for_db = []
            skipped_for_db = []

            def process_test_data(t):
                st_inf = TestsService().get_test_by_nodeid_and_test_run_uuid(
                    t["@classname"] + "." + t["@name"], test_run_uuid
                )
                if st_inf is None:
                    print("TODO None from get_test_by_nodeid_and_test_run_uuid")
                item = {
                    "location": st_inf["location"],
                    "nodeid": st_inf["nodeid"],
                    "status": self.xml_status(t),
                    "testRunUuid": test_run_uuid,
                    "uuid": st_inf["uuid"],
                    "duration": float(t["@time"]),
                }
                tests_for_db.append(item)

                if "failure" in t:
                    failure_dict = {"uuid": st_inf["uuid"]}
                    failure_dict["log"] = t["failure"]["#text"]
                    failure_dict["logMessage"] = t["failure"]["@message"]
                    if t["system-out"] != PYTEST_EMPTY_SYSTEM_OUT:
                        failure_dict["stdout"] = t["system-out"]
                    if t["system-err"] != PYTEST_EMPTY_SYSTEM_ERROR:
                        failure_dict["stderr"] = t["system-err"]
                    failures_for_db.append(failure_dict)

                if "skipped" in t:
                    skipped_dict = {"uuid": st_inf["uuid"]}
                    skipped_dict["log"] = t["skipped"]["#text"]
                    skipped_dict["logMessage"] = t["skipped"]["@message"]
                    skipped_for_db.append(skipped_dict)

            tests_data = json_data["testsuites"]["testsuite"]["testcase"]
            if isinstance(tests_data, list):
                for t in tests_data:
                    process_test_data(t)
            else:
                process_test_data(tests_data)

            self.mongo.save_objects(items=tests_for_db, collection_name="tests")
            if failures_for_db:
                xml_related.save_failed_logs.delay(failures_for_db)
            if skipped_for_db:
                xml_related.save_skipped_logs.delay(skipped_for_db)
        except Exception as e:
            print(e)
