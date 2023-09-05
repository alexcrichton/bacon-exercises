cargo_component_bindings::generate!();

use bindings::example::demo::greeter_candidates;
use bindings::exports::example::demo::greeter;

struct Component;

impl greeter::Guest for Component {
    fn greet() -> Result<greeter::Greeting, String> {
        let candidates = greeter_candidates::get();

        for candidate in candidates {
            let person = match candidate {
                greeter_candidates::Candidate::Hermit(_) => continue,
                greeter_candidates::Candidate::Excited(p) => p,
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
