from google.protobuf import timestamp_pb2 as _timestamp_pb2
import responses_pb2 as _responses_pb2
from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Mapping as _Mapping, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class TestStatus(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    UNKNOWN: _ClassVar[TestStatus]
    RUNNING: _ClassVar[TestStatus]
    PASSED: _ClassVar[TestStatus]
    FAILED: _ClassVar[TestStatus]
    SKIPPED: _ClassVar[TestStatus]
    EXPECTED_PASSED: _ClassVar[TestStatus]
    EXPECTED_FAILED: _ClassVar[TestStatus]
    ERROR: _ClassVar[TestStatus]
UNKNOWN: TestStatus
RUNNING: TestStatus
PASSED: TestStatus
FAILED: TestStatus
SKIPPED: TestStatus
EXPECTED_PASSED: TestStatus
EXPECTED_FAILED: TestStatus
ERROR: TestStatus

class StartTestRequest(_message.Message):
    __slots__ = ("uuid", "started_at", "status")
    UUID_FIELD_NUMBER: _ClassVar[int]
    STARTED_AT_FIELD_NUMBER: _ClassVar[int]
    STATUS_FIELD_NUMBER: _ClassVar[int]
    uuid: str
    started_at: _timestamp_pb2.Timestamp
    status: TestStatus
    def __init__(self, uuid: _Optional[str] = ..., started_at: _Optional[_Union[_timestamp_pb2.Timestamp, _Mapping]] = ..., status: _Optional[_Union[TestStatus, str]] = ...) -> None: ...

class StopTestRequest(_message.Message):
    __slots__ = ("uuid", "stopped_at", "status", "log", "stdout", "stderr")
    UUID_FIELD_NUMBER: _ClassVar[int]
    STOPPED_AT_FIELD_NUMBER: _ClassVar[int]
    STATUS_FIELD_NUMBER: _ClassVar[int]
    LOG_FIELD_NUMBER: _ClassVar[int]
    STDOUT_FIELD_NUMBER: _ClassVar[int]
    STDERR_FIELD_NUMBER: _ClassVar[int]
    uuid: str
    stopped_at: _timestamp_pb2.Timestamp
    status: TestStatus
    log: str
    stdout: str
    stderr: str
    def __init__(self, uuid: _Optional[str] = ..., stopped_at: _Optional[_Union[_timestamp_pb2.Timestamp, _Mapping]] = ..., status: _Optional[_Union[TestStatus, str]] = ..., log: _Optional[str] = ..., stdout: _Optional[str] = ..., stderr: _Optional[str] = ...) -> None: ...

class ModifyTestRequest(_message.Message):
    __slots__ = ("uuid", "started_at", "stopped_at", "status")
    UUID_FIELD_NUMBER: _ClassVar[int]
    STARTED_AT_FIELD_NUMBER: _ClassVar[int]
    STOPPED_AT_FIELD_NUMBER: _ClassVar[int]
    STATUS_FIELD_NUMBER: _ClassVar[int]
    uuid: str
    started_at: _timestamp_pb2.Timestamp
    stopped_at: _timestamp_pb2.Timestamp
    status: TestStatus
    def __init__(self, uuid: _Optional[str] = ..., started_at: _Optional[_Union[_timestamp_pb2.Timestamp, _Mapping]] = ..., stopped_at: _Optional[_Union[_timestamp_pb2.Timestamp, _Mapping]] = ..., status: _Optional[_Union[TestStatus, str]] = ...) -> None: ...
