cargo_component_bindings::generate!();

fn main() {
    println!("Hello, {}!", bindings::who_to_greet());
}
