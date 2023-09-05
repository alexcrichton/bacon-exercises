#!/bin/sh
set -ex

cargo component build
wasm-tools compose ../../../exercises/intercept-imports/intercept-imports.wasm \
  -d ./target/wasm32-wasi/debug/intercept_imports.wasm \
  -o answer.wasm
