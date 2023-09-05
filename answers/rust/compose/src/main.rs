cargo_component_bindings::generate!();

fn main() {
    println!("Hello, {}!", bindings::compose::who_to_greet());
}
