#!/bin/bash

set -e

WORK_DIR=$(pwd)
MAIN_PATH="$WORK_DIR/infra/ecr"

cd "$MAIN_PATH"

npm run deploy
cat cdktf.log