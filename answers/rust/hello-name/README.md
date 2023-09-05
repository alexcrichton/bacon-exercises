# Hello, $name!

This builds on the "Hello, world!" exercise by importing a custom function from
the `world` of the demo into this component. Bindings are generated for this
after it's configured with `cargo component` and then the `main` function is
reimplemented.

This project is generated with:

```
cargo component new hello-name
```

Then this section was added to `Cargo.toml`:

```toml
# ... in Cargo.toml

[package.metadata.component.target]
path = 'wit'
```

Then the WIT of the demo was copied to `wit/world.wit`.

And finally the component was built with

```
cargo component build
```
