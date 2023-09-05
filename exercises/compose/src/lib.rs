cargo_component_bindings::generate!();

struct Component;

impl bindings::Guest for Component {
    fn who_to_greet() -> String {
        if bindings::wasi::random::random::get_random_u64() % 2 == 0 {
            obfstr::obfstr!("Luna").to_string()
        } else {
            obfstr::obfstr!("Jasper").to_string()
        }
    }
}
