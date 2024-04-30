import logging
import threading
from typing import Any

from schemas.test import Test, TestsList
from schemas.test_run import TestRun

# Logger config
logging.config.fileConfig("logging.conf", disable_existing_loggers=False)

# Get root logger
logger = logging.getLogger(__name__)


class InMemoryStorage:
    _instance = None

    def __init__(self):
        self.test_runs = []
        self.tests = []
        self.lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    # TestRun

    def create_test_run(self, test_run: TestRun):
        self.test_runs.append(test_run)

    def get_test_run(self, test_run_uuid: str) -> TestRun | None:
        for test_run in self.test_runs:
            if test_run["uuid"] == test_run_uuid:
                return test_run
        return None

    def modify_test_run(self, test_run_uuid: str, modified_data: {str: int}):
        with self.lock:
            test_run_dict = {test_run["uuid"]: test_run for test_run in self.test_runs}
            if test_run_uuid in test_run_dict:
                test_run = test_run_dict[test_run_uuid]
                for key, value in modified_data.items():
                    if value is not None:
                        test_run[key] = value

    def remove_test_run(self, test_run_uuid: str):
        with self.lock:
            self.test_runs = [
                item for item in self.test_runs if item["uuid"] != test_run_uuid
            ]

    # Test

    def get_test(self, test_uuid: str) -> Test | None:
        for item in self.tests:
            if item["uuid"] == test_uuid:
                return item
        return None

    def get_test_by_nodeid_and_test_run_uuid(
        self, nodeid: str, test_run_uuid: str
    ) -> Test | None:
        for item in self.tests:
            if item["nodeid"] == nodeid and item["testRunUuid"] == test_run_uuid:
                return item
        return None

    def get_test_by_test_run_uuid(self, test_run_uuid: str) -> Test | None:
        for item in self.tests:
            if item["testRunUuid"] == test_run_uuid:
                return item
        return None

    def modify_test(self, modified_test: Test):
        with self.lock:
            test_dict = {test["uuid"]: test for test in self.tests}
            if modified_test["uuid"] in test_dict:
                test = test_dict[modified_test["uuid"]]
                for key, value in modified_test.items():
                    if value is not None:
                        test[key] = value

    # Tests

    def create_tests(self, tests: TestsList):
        with self.lock:
            for item in tests:
                if not any(
                    existing_test["nodeid"] == item["nodeid"]
                    for existing_test in self.tests
                ):
                    self.tests.append(item)

    def remove_tests(self, test_run_uuid: str):
        with self.lock:
            self.tests = [
                test for test in self.tests if test["testRunUuid"] != test_run_uuid
            ]

    def get_tests_linked_to_test_run(self, test_run_uuid: str) -> list[dict[str, Any]]:
        tests_storage_data = []
        for item in self.tests:
            if item["testRunUuid"] == test_run_uuid:
                tests_storage_data.append(
                    {
                        "uuid": item["uuid"],
                        "status": item.get("status", None),
                        "startedAt": item.get("startedAt", None),
                        "stoppedAt": item.get("stoppedAt", None),
                    }
                )
        return tests_storage_data

    def get_running_tests_by_test_run_id(
        self, test_run_uuid: str
    ) -> list[dict[str, Any]]:
        tests_storage_data = []
        for item in self.tests:
            if item["testRunUuid"] == test_run_uuid and "startedAt" in item:
                if item["startedAt"] is not None and "stoppedAt" not in item:
                    tests_storage_data.append(
                        {
                            "uuid": item["uuid"],
                            "status": item["status"],
                            "location": item["location"],
                        }
                    )
        return tests_storage_data

    # Other

    def save_test_run_and_test_data(
        self, test_run_uuid: str, stopped_at: str
    ) -> dict[str, int] | bool:
        test_statuses = {"passed": 0, "failed": 0, "skipped": 0}
        # Filter relevant tests for the test_run UUID
        relevant_tests = [
            test for test in self.tests if test["testRunUuid"] == test_run_uuid
        ]
        for item in relevant_tests:
            if "status" not in item:
                return False
            status = item["status"].lower()
            if (status == "running") or ("stoppedAt" not in item):
                return False
            test_statuses[status] += 1
        self.modify_test_run(
            test_run_uuid,
            {
                "passed": test_statuses["passed"],
                "failed": test_statuses["failed"],
                "skipped": test_statuses["skipped"],
                "stoppedAt": stopped_at,
            },
        )
        return test_statuses


st = InMemoryStorage()
