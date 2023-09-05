cargo_component_bindings::generate!();

use bindings::example::demo::who_to_greet;
use bindings::exports::example::demo::greeter;

struct Component;

impl greeter::Guest for Component {
    fn greet() -> Result<greeter::Greeting, String> {
        let candidates = who_to_greet::greeting_candidates();

        for candidate in candidates {
            let person = match candidate {
                who_to_greet::Candidate::Hermit(_) => continue,
                who_to_greet::Candidate::Excited(p) => p,
            };
            let lego_count = match person.lego_count {
                Some(n) if n > 0 => n,
                _ => continue,
            };
            return Ok(greeter::Greeting {
                saying: format!("Hello, {}!", person.name),
                lego_count,
            });
        }

        Err("no candidates".to_string())
    }
}
