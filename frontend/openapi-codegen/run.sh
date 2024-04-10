#!/bin/bash
npx --yes @openapitools/openapi-generator-cli generate -i openapi.json -g typescript-axios -c config.json -o client
