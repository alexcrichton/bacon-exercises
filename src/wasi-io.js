const output = document.getElementById('console-output');

export function iprint(s) {
  const element = document.createElement('span');
  element.classList.add('info');
  element.innerText = s;
  output.appendChild(element);
}

export function print(s) {
  output.innerHTML += s;
}

export function eprint(s) {
  const element = document.createElement('span');
  element.classList.add('error');
  element.innerText = s;
  output.appendChild(element);
}

const decoder = new TextDecoder('utf-8');

export const streams = {
  read(s, len) {
    throw new Error(`[streams] Read ${s} ${len}`);
  },
  blockingRead(s, len) {
    throw new Error(`[streams] Blocking read ${s} ${len}`);
  },
  skip(s, _len) {
    throw new Error(`[streams] Skip ${s}`);
  },
  blockingSkip(s, _len) {
    throw new Error(`[streams] Blocking skip ${s}`);
  },
  subscribeToInputStream(s) {
    throw new Error(`[streams] Subscribe to input stream ${s}`);
  },
  dropInputStream(s) {
    throw new Error(`[streams] Drop input stream ${s}`);
  },
  write(s, buf) {
    return streams.blockingWrite(s, buf);
  },
  blockingWrite(s, buf) {
    const text = decoder.decode(buf);
    if (s == 1) {
      print(text);
    } else if (s == 2) {
      eprint(text);
    } else {
      throw new Error(`[streams] write to ${s} of ${buf}: unkonwn descriptor`);
    }
    return [BigInt(buf.length), 'open'];
  },
  writeZeroes(s, _len) {
    throw new Error(`[streams] Write zeroes ${s}`);
  },
  blockingWriteZeroes(s, _len) {
    throw new Error(`[streams] Blocking write zeroes ${s}`);
  },
  splice(s, _src, _len) {
    throw new Error(`[streams] Splice ${s}`);
  },
  blockingSplice(s, _src, _len) {
    throw new Error(`[streams] Blocking splice ${s}`);
  },
  forward(s, _src) {
    throw new Error(`[streams] Forward ${s}`);
  },
  subscribeToOutputStream(s) {
    throw new Error(`[streams] Subscribe to output stream ${s}`);
  },
  dropOutputStream(s) {
    throw new Error(`[streams] Drop output stream ${s}`);
  }
};
