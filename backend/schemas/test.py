from datetime import datetime
from enum import StrEnum
from typing import Annotated, Optional

from pydantic import BaseModel, Field, RootModel


class TestStatus(StrEnum):
    RUNNING = "RUNNING"
    PASSED = "PASSED"
    FAILED = "FAILED"
    SKIPPED = "SKIPPED"
    EXPECTED_PASSED = "EXPECTED_PASSED"
    EXPECTED_FAILED = "EXPECTED_FAILED"
    ERROR = "ERROR"


class Test(BaseModel):
    _id: Annotated[str, Field(exclude=True)]
    uuid: str
    location: Optional[str] = None
    nodeid: Optional[str] = None
    testRunUuid: Optional[str] = None
    description: Optional[str] = None
    startedAt: Optional[datetime] = None
    stoppedAt: Optional[datetime] = None
    status: Optional[TestStatus] = None
    log: Optional[str] = None
    stdout: Optional[str] = None
    stderr: Optional[str] = None


class TestsList(RootModel):
    root: list[Test]
