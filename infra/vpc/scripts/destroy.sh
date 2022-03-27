#!/bin/bash

set -e

WORK_DIR=$(pwd)
MAIN_PATH="$WORK_DIR/infra/vpc"

cd "$MAIN_PATH"

npm run destroy
cat cdktf.log