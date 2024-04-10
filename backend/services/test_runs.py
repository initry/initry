import datetime

import pymongo
from pymongo.collection import Collection

from services.main import AppService
from storage import st
from ws.ws import wsm


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
        with self.lock:
            today_date = datetime.date.today()
            last_test_run = self.find_last_test_run()
            if last_test_run is None:
                return f"#{today_date.strftime('%Y%m%d')}.1"
            if last_test_run["runName"]:
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
