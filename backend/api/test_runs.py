from fastapi import APIRouter

from schemas.test_run import TestRun, TestRunsList
from services.test_runs import TestRunsService

test_run_router = APIRouter(prefix="/api/test-runs")
test_run_service = TestRunsService()


@test_run_router.get(
    "/latest",
    operation_id="getLatestTestRuns",
    response_model=TestRunsList,
    tags=["Test runs"],
)
def get_latest_test_runs():
    return test_run_service.get_latest_test_runs(10)


@test_run_router.get(
    "/{test_run_id}",
    operation_id="getTestRunById",
    response_model=TestRun,
    tags=["Test runs"],
)
def get_test_run_by_id(test_run_id):
    return test_run_service.get_test_run_by_id(test_run_id)
