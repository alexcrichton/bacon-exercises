# `{ Hello: "$name!" }`

First generate the project with

```
cargo component new --reactor hello-structured
```

Then update `hello-structured/wit/world.wit` with the contents of the demo's WIT
file.

Next edit `src/lib.rs` with the contents of the exercise, and finally build
with:

```
cargo component build
```
