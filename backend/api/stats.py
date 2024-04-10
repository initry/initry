from fastapi import APIRouter

from schemas.test_run import TestRunsTotalData, TestRunsTrend
from services.stats import StatsService

stats_router = APIRouter(prefix="/api/stats")
stats_service = StatsService()


# currently not used
@stats_router.get(
    "/total-data",
    operation_id="getTestRunsTotalData",
    response_model=TestRunsTotalData,
    tags=["Stats"],
)
def get_total_data():
    return stats_service.test_runs_total_data(7)


@stats_router.get(
    "/trend", operation_id="getTrendData", response_model=TestRunsTrend, tags=["Stats"]
)
def get_trend():
    return stats_service.get_trend(7)
