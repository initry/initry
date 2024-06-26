# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: test.proto
# Protobuf Python Version: 4.25.1
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


from google.protobuf import timestamp_pb2 as google_dot_protobuf_dot_timestamp__pb2
import responses_pb2 as responses__pb2


DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\ntest.proto\x1a\x1fgoogle/protobuf/timestamp.proto\x1a\x0fresponses.proto\"m\n\x10StartTestRequest\x12\x0c\n\x04uuid\x18\x01 \x01(\t\x12.\n\nstarted_at\x18\x02 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12\x1b\n\x06status\x18\x03 \x01(\x0e\x32\x0b.TestStatus\"\x99\x01\n\x0fStopTestRequest\x12\x0c\n\x04uuid\x18\x01 \x01(\t\x12.\n\nstopped_at\x18\x02 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12\x1b\n\x06status\x18\x03 \x01(\x0e\x32\x0b.TestStatus\x12\x0b\n\x03log\x18\x04 \x01(\t\x12\x0e\n\x06stdout\x18\x05 \x01(\t\x12\x0e\n\x06stderr\x18\x06 \x01(\t\"\xcb\x01\n\x11ModifyTestRequest\x12\x0c\n\x04uuid\x18\x01 \x01(\t\x12.\n\nstarted_at\x18\x02 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12.\n\nstopped_at\x18\x03 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12\x1b\n\x06status\x18\x04 \x01(\x0e\x32\x0b.TestStatus\x12\x0b\n\x03log\x18\x05 \x01(\t\x12\x0e\n\x06stdout\x18\x06 \x01(\t\x12\x0e\n\x06stderr\x18\x07 \x01(\t*\x80\x01\n\nTestStatus\x12\x0b\n\x07UNKNOWN\x10\x00\x12\x0b\n\x07RUNNING\x10\x01\x12\n\n\x06PASSED\x10\x02\x12\n\n\x06\x46\x41ILED\x10\x03\x12\x0b\n\x07SKIPPED\x10\x04\x12\x13\n\x0f\x45XPECTED_PASSED\x10\x05\x12\x13\n\x0f\x45XPECTED_FAILED\x10\x06\x12\t\n\x05\x45RROR\x10\x07\x32\x61\n\x0bTestService\x12)\n\tStartTest\x12\x11.StartTestRequest\x1a\t.StatusOk\x12\'\n\x08StopTest\x12\x10.StopTestRequest\x1a\t.StatusOk2H\n\x17\x43lientStreamTestService\x12-\n\nModifyTest\x12\x12.ModifyTestRequest\x1a\t.StatusOk(\x01\x62\x06proto3')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'test_pb2', _globals)
if _descriptor._USE_C_DESCRIPTORS == False:
  DESCRIPTOR._options = None
  _globals['_TESTSTATUS']._serialized_start=538
  _globals['_TESTSTATUS']._serialized_end=666
  _globals['_STARTTESTREQUEST']._serialized_start=64
  _globals['_STARTTESTREQUEST']._serialized_end=173
  _globals['_STOPTESTREQUEST']._serialized_start=176
  _globals['_STOPTESTREQUEST']._serialized_end=329
  _globals['_MODIFYTESTREQUEST']._serialized_start=332
  _globals['_MODIFYTESTREQUEST']._serialized_end=535
  _globals['_TESTSERVICE']._serialized_start=668
  _globals['_TESTSERVICE']._serialized_end=765
  _globals['_CLIENTSTREAMTESTSERVICE']._serialized_start=767
  _globals['_CLIENTSTREAMTESTSERVICE']._serialized_end=839
# @@protoc_insertion_point(module_scope)
