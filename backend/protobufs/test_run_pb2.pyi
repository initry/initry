from typing import ClassVar as _ClassVar
from typing import Mapping as _Mapping
from typing import Optional as _Optional
from typing import Union as _Union

import responses_pb2 as _responses_pb2
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import timestamp_pb2 as _timestamp_pb2

DESCRIPTOR: _descriptor.FileDescriptor

class CreateTestRunRequest(_message.Message):
    __slots__ = ("uuid", "started_at", "tests_count", "plugin_type")
    UUID_FIELD_NUMBER: _ClassVar[int]
    STARTED_AT_FIELD_NUMBER: _ClassVar[int]
    TESTS_COUNT_FIELD_NUMBER: _ClassVar[int]
    PLUGIN_TYPE_FIELD_NUMBER: _ClassVar[int]
    uuid: str
    started_at: _timestamp_pb2.Timestamp
    tests_count: int
    plugin_type: str
    def __init__(
        self,
        uuid: _Optional[str] = ...,
        started_at: _Optional[_Union[_timestamp_pb2.Timestamp, _Mapping]] = ...,
        tests_count: _Optional[int] = ...,
        plugin_type: _Optional[str] = ...,
    ) -> None: ...

class StopTestRunRequest(_message.Message):
    __slots__ = ("uuid", "stopped_at")
    UUID_FIELD_NUMBER: _ClassVar[int]
    STOPPED_AT_FIELD_NUMBER: _ClassVar[int]
    uuid: str
    stopped_at: _timestamp_pb2.Timestamp
    def __init__(
        self,
        uuid: _Optional[str] = ...,
        stopped_at: _Optional[_Union[_timestamp_pb2.Timestamp, _Mapping]] = ...,
    ) -> None: ...
