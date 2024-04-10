from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, RootModel


class TestRun(BaseModel):
    uuid: str
    testsCount: int = 0
    runName: str
    startedAt: Optional[datetime] = None
    stoppedAt: Optional[datetime] = None
    passed: Optional[int] = None
    failed: Optional[int] = None
    skipped: Optional[int] = None
    pluginType: str
    # expectedPassed: Optional[int] = None
    # expectedFailed: Optional[int] = None
    # error: Optional[int] = None


class TestRunsList(RootModel):
    root: list[TestRun]


class TestRunsTotalData(BaseModel):
    totalTests: int
    totalPassed: int
    totalFailed: int
    totalSkipped: int


class TestRunsTrend(BaseModel):
    passed: List[int]
    failed: List[int]
    skipped: List[int]
