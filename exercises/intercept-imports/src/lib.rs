cargo_component_bindings::generate!();

struct Component;

impl bindings::exports::wasi::cli::run::Guest for Component {
    fn run() -> Result<(), ()> {
        obfstr::obfstr! {
            let key = "CAN_I_PRINT_THE_ANSWER";
            let yes = "yes";
            let no = "no";
            let lovecraft = "\
Nice job on successfully interposing! The original component has been thoroughly
tricked.

Here's a lovecraft quote:

The ocean ate the last of the land and poured into the smoking gulf, thereby
giving up all it had ever conquered. From the new-flooded lands it flowed
again, uncovering death and decay; and from its ancient and immemorial bed it
trickled loathsomely, uncovering nighted secrets of the years when Time was
young and the gods unborn. Above the waves rose weedy remembered spires. The
moon laid pale lilies of light on dead London, and Paris stood up from its damp
grave to be sanctified with star-dust. Then rose spires and monoliths that were
weedy but not remembered; terrible spires and monoliths of lands that men never
knew were lands...";
            let confusion = "please don't optimize out the answer variable";
        }
        for (k, v) in bindings::wasi::cli::environment::get_environment() {
            if k != key {
                if k == confusion {
                    println!("The answer is: ");
                }
                continue;
            }
            if v == yes {
                println(lovecraft);
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
    let _ = bindings::wasi::io::streams::blocking_write(stdout, s.as_bytes());
}
