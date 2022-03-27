#!/bin/bash

set -e

WORK_DIR=$(pwd)
MAIN_PATH="$WORK_DIR/infra/eip"

cd "$MAIN_PATH"

cdktf destroy --auto-approve
