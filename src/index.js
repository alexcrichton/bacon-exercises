import { transpile } from '@bytecodealliance/jco';
import { iprint, eprint } from './wasi-io.js';
import { reset_who_to_greet } from 'who-to-greet';

const input = document.getElementById('file');
const output = document.getElementById('console-output');
const okDiv = document.getElementById('ok');
const badDiv = document.getElementById('bad');

input.onchange = e => {
  okDiv.classList.remove("selected");
  badDiv.classList.remove("selected");
  input.disabled = true;
  output.innerHTML = '';
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
        input.disabled = false;
      })
  }
};
input.disabled = false;

async function runExercise(exercise, content) {
  let ok = false;
  switch (exercise) {
    case 'hello':
      const run = await compileExercise(content);
      run();
      ok = output.innerText == "Hello, world!\n";
      break;
    case 'hello-name':
      const run1 = await compileExercise(content);
      const name1 = reset_who_to_greet();
      iprint(`Expecting a greeting for ${name1}\n`);
      run1();
      ok = output.innerText.endsWith(`Hello, ${name1}!\n`);
      if (ok) {
        const run2 = await compileExercise(content);
        const name2 = reset_who_to_greet();
        iprint(`Expecting a greeting for ${name2}\n`);
        run2();
        ok = output.innerText.endsWith(`Hello, ${name2}!\n`);
      }
      break;
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
    throw new Error(`Unknown import: ${i}\n`);
  }

  const source = result.files['demo.js'];
  const url = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
  const mod = await import(url);
  if (mod['wasi:cli/run'] === undefined) {
    throw new Error("export `wasi:cli/run` not found");
  }
  return mod['wasi:cli/run'].run;
}

// tab management, sorta
$('.nav a').click(function(e) {
  e.preventDefault();
  $(this).tab('show');
});
$("ul.nav-tabs > li > a").on("shown.bs.tab", function(e) {
  var id = $(e.target).attr("href").substr(1);
  window.location.hash = id;
});
const hash = window.location.hash;
$('.nav a[href="' + hash + '"]').tab('show');
