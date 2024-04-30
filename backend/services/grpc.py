import threading

from google.protobuf.json_format import MessageToDict
from starlette.background import BackgroundTask

from database.mongo import MongoDB
from protobufs import test_pb2_grpc, test_run_pb2_grpc, tests_pb2_grpc
from services.test_runs import TestRunsService
from storage import st
from tasks.test_logs import write_test_log
from tasks.test_run_finalization import update_tests_by_id
from ws.ws import wsm


class TestRunServiceHandler(test_run_pb2_grpc.TestRunServiceServicer):
    def __init__(self):
        self.lock = threading.Lock()

    def CreateTestRun(self, request, context):
        test_run = MessageToDict(request)
        check = st.get_test_run(test_run["uuid"])
        if check:
            return tests_pb2_grpc.responses__pb2.StatusOk(status="ok")
        with self.lock:
            st.create_test_run(test_run)
            if test_run["pluginType"] == "pytest.xml":
                test_run["runName"] = TestRunsService().generate_run_id()
                MongoDB().insert_object(test_run, "test_runs")
                del test_run["_id"]
                wsm.add(message={"type": "test_run", **test_run}, channel="live")
            return tests_pb2_grpc.responses__pb2.StatusOk(status="ok")

    def StopTestRun(self, request, context):
        incoming_test_run = MessageToDict(request)
        test_run = st.get_test_run(incoming_test_run["uuid"])  # , 'passed': 1}
        if test_run is not None:
            if "stoppedAt" in test_run:
                return tests_pb2_grpc.responses__pb2.StatusOk(status="ok")
        else:
            return tests_pb2_grpc.responses__pb2.StatusOk(status="ok")
        with self.lock:
            if test_run["pluginType"] != "pytest.xml":
                # Save test_run data and test tatuses count in storage
                test_statuses = st.save_test_run_and_test_data(
                    incoming_test_run["uuid"], incoming_test_run["stoppedAt"]
                )
                if not test_statuses:
                    return tests_pb2_grpc.responses__pb2.StatusOk(status="ok")
                wsm.add(
                    message={"type": "test_run", **incoming_test_run, **test_statuses},
                    channel="live",
                )
                BackgroundTask(
                    MongoDB().modify_object(
                        {"uuid": incoming_test_run["uuid"]},
                        {**test_statuses, "stoppedAt": incoming_test_run["stoppedAt"]},
                        "test_runs",
                    )
                )
                tests_to_save_in_db = st.get_tests_linked_to_test_run(
                    incoming_test_run["uuid"]
                )
                update_tests_by_id.delay(tests_to_save_in_db, "tests")
                wsm.add(
                    message={"type": "test_run", **incoming_test_run, **test_statuses},
                    channel=f"test-run/{incoming_test_run['uuid']}",
                )
            else:
                # Get data from database, because memory storage wasn't used for xml only test run
                test_run = TestRunsService().get_test_run_by_id(
                    incoming_test_run["uuid"]
                )
                if "stoppedAt" in test_run:
                    return tests_pb2_grpc.responses__pb2.StatusOk(status="ok")
                test_statuses = {
                    "passed": test_run["passed"],
                    "failed": test_run["failed"],
                    "skipped": test_run["skipped"],
                }
                wsm.add(
                    message={
                        "type": "test_run",
                        **incoming_test_run,
                        **test_statuses,
                        "testsCount": test_run["testsCount"],
                    },
                    channel="live",
                )
                BackgroundTask(
                    MongoDB().modify_object(
                        {"uuid": incoming_test_run["uuid"]},
                        {"stoppedAt": incoming_test_run["stoppedAt"]},
                        "test_runs",
                    )
                )
                wsm.add(
                    message={"type": "test_run", **incoming_test_run, **test_statuses},
                    channel=f"test-run/{incoming_test_run['uuid']}",
                )
            # ("StopTestRun: remove test run: ", incoming_test_run["uuid"])
            BackgroundTask(st.remove_test_run(incoming_test_run["uuid"]))
            BackgroundTask(st.remove_tests(incoming_test_run["uuid"]))
            return tests_pb2_grpc.responses__pb2.StatusOk(status="ok")


class TestsServiceHandler(tests_pb2_grpc.TestsServiceServicer):
    def CreateTests(self, request, context):
        tests = MessageToDict(request)
        test_run = st.get_test_run(tests["tests"][0]["testRunUuid"])
        if not test_run:
            return tests_pb2_grpc.responses__pb2.StatusOk(status="ok")
        check_any_test = st.get_test_by_test_run_uuid(tests["tests"][0]["testRunUuid"])
        if check_any_test:
            return tests_pb2_grpc.responses__pb2.StatusOk(status="ok")
        st.create_tests(tests["tests"])
        if "onlyTestsInfo" in tests:
            if tests["onlyTestsInfo"]:
                return tests_pb2_grpc.responses__pb2.StatusOk(status="ok")
        this_run_num = TestRunsService().generate_run_id()
        test_run["runName"] = this_run_num
        MongoDB().insert_object(test_run, "test_runs")
        MongoDB().save_objects(tests["tests"], "tests")
        del test_run["_id"]
        wsm.add(message={"type": "test_run", **test_run}, channel="live")
        return tests_pb2_grpc.responses__pb2.StatusOk(status="ok")


# Start test / Stop test function
def modify_test_run(test, test_run_uuid, test_run):
    if test["status"] == "PASSED":
        st.modify_test_run(
            test_run_uuid=test_run_uuid,
            modified_data={
                "passed": test_run["passed"] + 1 if "passed" in test_run else 1
            },
        )
    if test["status"] == "FAILED":
        st.modify_test_run(
            test_run_uuid=test_run_uuid,
            modified_data={
                "failed": test_run["failed"] + 1 if "failed" in test_run else 1
            },
        )
    if test["status"] == "SKIPPED":
        st.modify_test_run(
            test_run_uuid=test_run_uuid,
            modified_data={
                "skipped": test_run["skipped"] + 1 if "skipped" in test_run else 1
            },
        )


class TestServiceHandler(test_pb2_grpc.TestServiceServicer):

    def __init__(self):
        self.lock = threading.Lock()

    def StartTest(self, request, context):
        test = MessageToDict(request)
        check = st.get_test(test["uuid"])
        if check is None:
            return tests_pb2_grpc.responses__pb2.StatusOk(status="ok")
        if "status" in check or "startedAt" in check or "stoppedAt" in check:
            return tests_pb2_grpc.responses__pb2.StatusOk(status="ok")
        if check is None:
            return tests_pb2_grpc.responses__pb2.StatusOk(status="ok")
        with self.lock:
            st.modify_test(modified_test=test)
            test_obj = st.get_test(test["uuid"])
            test_run_uuid = test_obj["testRunUuid"]
            wsm.add(
                message={
                    "type": "test",
                    "uuid": test["uuid"],
                    "status": test["status"],
                    "location": test_obj["location"],
                    "testRunUuid": test_run_uuid,
                },
                channel=f"test-run/{test_run_uuid}",
            )
            return tests_pb2_grpc.responses__pb2.StatusOk(status="ok")

    def StopTest(self, request, context):
        test = MessageToDict(request)
        check = st.get_test(test["uuid"])
        if check is None:
            return tests_pb2_grpc.responses__pb2.StatusOk(status="ok")
        with self.lock:
            st.modify_test(modified_test=test)
            test_obj = st.get_test(test["uuid"])
            if test_obj is None:
                return tests_pb2_grpc.responses__pb2.StatusOk(status="ok")
            test_run_uuid = test_obj["testRunUuid"]
            test_run = st.get_test_run(test_run_uuid)
            if test_run is None:
                return tests_pb2_grpc.responses__pb2.StatusOk(status="ok")
            modify_test_run(test, test_run_uuid, test_run)
            found_strings = []
            if "log" in test or "stdout" in test or "stderr" in test:
                if "log" in test:
                    found_strings.append("log")
                if "stdout" in test:
                    found_strings.append("stdout")
                if "stderr" in test:
                    found_strings.append("stderr")
                write_test_log.delay(test, found_strings)
            message = {
                "type": "test",
                "uuid": test["uuid"],
                "status": test["status"],
                "testRunUuid": test_run_uuid,
            }
            wsm.add(message=message, channel="live")
            message["startedAt"] = test_obj["startedAt"]
            message["stoppedAt"] = test["stoppedAt"]
            wsm.add(message=message, channel=f"test-run/{test_run_uuid}")
            return tests_pb2_grpc.responses__pb2.StatusOk(status="ok")


class ClientStreamTestServiceHandler(test_pb2_grpc.ClientStreamTestServiceServicer):
    def ModifyTest(self, request_iterator, context):
        for request in request_iterator:
            test = MessageToDict(request)
            st.modify_test(modified_test=test)
            test_obj = st.get_test(test["uuid"])
            test_run_uuid = test_obj["testRunUuid"]
            test_run = st.get_test_run(test_run_uuid)
            modify_test_run(test, test_run_uuid, test_run)
            found_strings = []
            if "log" in test or "stdout" in test or "stderr" in test:
                if "log" in test:
                    found_strings.append("log")
                if "stdout" in test:
                    found_strings.append("stdout")
                if "stderr" in test:
                    found_strings.append("stderr")
                write_test_log.delay(test, found_strings)
            message = {
                "type": "test",
                "uuid": test["uuid"],
                "status": test["status"],
                "testRunUuid": test_run_uuid,
            }
            wsm.add(message=message, channel="live")
            wsm.add(message=message, channel=f"test-run/{test_run_uuid}")
        return tests_pb2_grpc.responses__pb2.StatusOk(status="ok")
