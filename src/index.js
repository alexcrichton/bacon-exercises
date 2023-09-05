import { transpile } from '@bytecodealliance/jco';
import { iprint, eprint } from './wasi-io.js';
import { reset_who_to_greet } from 'who-to-greet';
import { $reset_candidates } from 'example:demo/greeter-candidates';
import { $fixRandomU64, $unfixRandomU64 } from './random-shim.js';
import { _setEnv } from "@bytecodealliance/preview2-shim/cli";

const input = document.getElementById('file');
const output = document.getElementById('console-output');
const okDiv = document.getElementById('ok');
const badDiv = document.getElementById('bad');

input.onchange = e => {
  input.disabled = true;
  reset();
  const exercise = document.querySelector('.active.tab-pane').id;
  console.log('running exercise', exercise);

  const file = e.target.files[0];
  const reader = new FileReader();
  reader.readAsArrayBuffer(file,'UTF-8');
  reader.onload = readerEvent => {
    const content = readerEvent.target.result;

    runExercise(exercise, content)
      .catch(e => {
        console.log('caught error', e);
        eprint(e.toString());
        badDiv.classList.add("selected");
      })
      .finally(() => {
        $unfixRandomU64();
        _setEnv({});
        input.disabled = false;
      })
  }
};
input.disabled = false;

function reset() {
  okDiv.classList.remove("selected");
  badDiv.classList.remove("selected");
  output.innerHTML = '';
}

async function runExercise(exercise, content) {
  let ok = true;
  switch (exercise) {
    case 'hello': {
      const run = getCommand(await compileExercise(content));
      run();
      ok = output.innerText == "Hello, world!\n";
      break;
    }
    case 'hello-name': {
      for (let i = 0; i < 2 && ok; i++) {
        const run = getCommand(await compileExercise(content));
        const name = reset_who_to_greet();
        iprint(`Expecting a greeting for ${name}\n`);
        run();
        ok = output.innerText.endsWith(`Hello, ${name}!\n`);
      }
      break;
    }
    case 'hello-structured': {
      const output = await compileExercise(content);
      const greeter = output['example:demo/greeter'];
      if (greeter === undefined) {
        eprint(`Expected export of "example:demo/greeter" not found`)
        ok = false;
      } else {
        const expected = $reset_candidates();
        const greeting = greeter.greet();

        if (expected.saying !== greeting.saying) {
          eprint(`Saying of "${greeting.saying}" did not match expectation of "${expected.saying}"`);
          ok = false;
        } else if (expected.legoCount !== greeting.legoCount) {
          eprint(`Lego count of ${greeting.legoCount} did not match expectation of ${expected.legoCount}`);
          ok = false;
        } else {
          iprint("Greeting matched!");
          console.log(expected, greeting);
        }
      }
      break;
    }
    case 'compose': {
      const n = $fixRandomU64();
      const run = getCommand(await compileExercise(content));
      run();
      if (n % 2n == 0n) {
        ok = output.innerText == "Hello, Luna!\n";
      } else {
        ok = output.innerText == "Hello, Jasper!\n";
      }
      break;
    }
    case 'intercept-imports': {
      // Surely no one would read this source code and try to upload something
      // which doesn't achieve the result through composition. Right? Right?
      _setEnv({
        YOU: "are on the right track",
        PERHAPS: "the next variable is interesting",
        CAN_I_PRINT_THE_ANSWER: 'no',
        WHAT: "would happen if that variable changed",
      });
      const run = getCommand(await compileExercise(content));
      run();
      ok = output.innerText.indexOf("The ocean ate the last of the land") !== -1;
      break;
    }
    default:
      throw new Error("unknown exercise");
  }

  if (ok) {
    okDiv.classList.add("selected");
  } else {
    badDiv.classList.add("selected");
  }

}

async function compileExercise(content) {
  const transpileOpts = {
    quiet: true,
    name: 'demo',
    optimize: false,
    wasiShim: true,
    nodejsCompat: false,
    noTypescript: true,

    // keep everything in the blob url created below to avoid fetches to files
    // that don't exist outside of the blob.
    base64Cutoff: 2 ** 32 - 1,
  };
  const result = await transpile(content, transpileOpts);

  for (let i of result.imports) {
    if (i.startsWith("@bytecodealliance/preview2-shim")) {
      continue;
    }

    if (i == 'who-to-greet')
      continue;
    if (i.startsWith("example:demo/"))
      continue;
    throw new Error(`Unknown import: ${i}\n`);
  }

  const source = result.files['demo.js'];
  const url = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
  return await import(url);
}

function getCommand(mod) {
  if (mod['wasi:cli/run'] === undefined) {
    throw new Error("export `wasi:cli/run` not found");
  }
  return mod['wasi:cli/run'].run;
}

// tab management, sorta
$('.nav a').click(function(e) {
  e.preventDefault();
  reset();
  $(this).tab('show');
});
$("ul.nav-tabs > li > a").on("shown.bs.tab", function(e) {
  var id = $(e.target).attr("href").substr(1);
  window.location.hash = id;
});
const hash = window.location.hash;
$('.nav a[href="' + hash + '"]').tab('show');
