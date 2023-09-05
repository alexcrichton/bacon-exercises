#!/bin/sh
set -ex
cargo component build --target wasm32-unknown-unknown --release
wasm-tools strip -a ./target/wasm32-unknown-unknown/release/compose.wasm -o compose.wasm
ls -alh compose.wasm
