import { transpile } from '@bytecodealliance/jco';
import { eprint } from './wasi-io.js';

const input = document.getElementById('file');
const output = document.getElementById('console-output');
const ok = document.getElementById('ok');
const bad = document.getElementById('bad');

input.onchange = e => {
  ok.classList.remove("selected");
  bad.classList.remove("selected");
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
        bad.classList.add("selected");
      })
      .finally(() => {
        input.disabled = false;
      })
  }
};
input.disabled = false;

async function runExercise(exercise, content) {
  const run = await compileExercise(content);
  run();

  let expected = "";
  switch (exercise) {
    case 'hello':
      expected = "Hello, world!\n";
      break;
    default:
      throw new Error("unknown exercise");
  }

  if (expected == output.innerText) {
    ok.classList.add("selected");
  } else {
    bad.classList.add("selected");
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
    base64Cutoff: 2 ** 32 - 1
  };
  const result = await transpile(content, transpileOpts);

  for (let i of result.imports) {
    if (!i.startsWith("@bytecodealliance/preview2-shim")) {
      throw new Error(`Unknown import: ${i}\n`);
    }
  }

  const source = result.files['demo.js'];
  const url = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
  const mod = await import(url);
  if (mod['wasi:cli/run'] === undefined) {
    throw new Error("export `wasi:cli/run` not found");
  }
  return mod['wasi:cli/run'].run;
}
