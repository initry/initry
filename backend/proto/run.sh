#!/bin/bash

# Paths
proto_folder="."
protobufs_folder="../protobufs"

# List of proto files
proto_files=('responses.proto' 'test_run.proto' 'test.proto' 'tests.proto')

# Run protobuf compilation commands in "proto" folder
for proto_file in "${proto_files[@]}"; do
    python -m grpc_tools.protoc -I . --python_out=. --pyi_out=. --grpc_python_out=. "$proto_file"
done

# Copy generated files to "protobufs" folder
mv ./*.py* "$protobufs_folder"
