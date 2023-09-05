cargo_component_bindings::generate!();

struct Component;

impl bindings::exports::wasi::cli::run::Guest for Component {
    fn run() -> Result<(), ()> {
        obfstr::obfstr! {
            let key = "CAN_I_PRINT_THE_ANSWER";
            let yes = "yes";
            let no = "no";
            let answer = "33";
        }
        for (k, v) in bindings::wasi::cli::environment::get_environment() {
            if k != key {
                continue;
            }
            if v == yes {
                println(&format!("The answer is {answer}"));
            } else if v == no {
                println("Sorry, I'm not allowed to print the answer");
            } else {
                println("I'm confused about whether I can print the answer or not");
            }
            return Ok(());
        }
        println("I don't know whether I can print the answer");
        Ok(())
    }
}

fn println(s: &str) {
    let stdout = bindings::wasi::cli::stdout::get_stdout();

    bindings::wasi::io::streams::blocking_write(stdout, s.as_bytes()).unwrap();
    // ..
}
