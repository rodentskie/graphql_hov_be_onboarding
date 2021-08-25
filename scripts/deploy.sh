#!/bin/bash

set -eou pipefail

AFFECTED="$(cat "$(pwd)"/affected)" && readonly AFFECTED

bazel_query() {
  npx bazel query --keep_going --noshow_progress "attr(name, deploy, rdeps(//..., set($1)))" | tr '\n' ' '
}

main() {
  local IFS && IFS=' '
  
  read -r -a rules <<< "$(bazel_query "${AFFECTED[@]}")"

  for rule in "${rules[@]}"; do
    npx bazel run "$rule"
  done
}

main