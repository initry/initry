from fastapi import APIRouter

from schemas.test import Test, TestsList
from services.tests import TestsService

tests_router = APIRouter(prefix="/api/tests")
tests_service = TestsService()


@tests_router.get(
    "/{test_id}", operation_id="getTestById", response_model=Test, tags=["Tests"]
)
def get_test_by_id(test_id):
    return tests_service.get_test_by_id(test_id)


@tests_router.get(
    "/", operation_id="getTestsFromTestRun", response_model=TestsList, tags=["Tests"]
)
def get_tests_from_test_run(test_run: str):
    return tests_service.get_tests_from_test_run(test_run)


@tests_router.get(
    "/{test_id}/history",
    operation_id="getHistoryByTestId",
    response_model=TestsList,
    tags=["Tests"],
)
def get_history_by_test_id(test_id):
    return tests_service.get_history_by_test_id(test_id)
