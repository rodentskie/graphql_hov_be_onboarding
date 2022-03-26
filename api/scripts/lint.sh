#!/bin/bash

set -eou pipefail

AFFECTED="$(cat "$(pwd)"/affected)" && readonly AFFECTED

bazel_query() {
  npx bazel query --keep_going --noshow_progress "attr(name, lint, rdeps(//..., set($1)))" | tr '\n' ' '
}

main() {
  local IFS && IFS=' '
  
  read -r -a rules <<< "$(bazel_query "${AFFECTED[@]}")"

  for rule in "${rules[@]}"; do
    npx bazel build "$rule"
  done
}

main