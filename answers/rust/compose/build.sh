#!/bin/sh
set -ex

cargo component build
wasm-tools compose ./target/wasm32-wasi/debug/compose-answer.wasm \
  -d ../../../exercises/compose/compose.wasm \
  -o compose.wasm
