cargo_component_bindings::generate!();

struct Component;

impl bindings::exports::wasi::cli::environment::Guest for Component {
    fn get_environment() -> Vec<(String, String)> {
        vec![("CAN_I_PRINT_THE_ANSWER".to_string(), "yes".to_string())]
    }

    fn get_arguments() -> Vec<String> {
        Vec::new()
    }

    fn initial_cwd() -> Option<String> {
        None
    }
}
