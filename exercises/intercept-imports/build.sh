#!/bin/sh
set -ex
cargo component build --target wasm32-unknown-unknown --release
wasm-tools strip -a ./target/wasm32-unknown-unknown/release/intercept_imports.wasm -o intercept-imports.wasm
ls -alh intercept-imports.wasm
