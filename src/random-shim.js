import { insecure as origInsecure, random as origRandom } from "https://unpkg.com/@bytecodealliance/preview2-shim@0.0.13/lib/browser/random.js";

export const insecure = origInsecure;

let fixedRandomU64 = null;

export const random = {
  getRandomBytes(len) {
    return origRandom.getRandomBytes(len);
  },

  getRandomU64 () {
    if (fixedRandomU64 === null) {
      return origRandom.getRandomU64();
    } else {
      return fixedRandomU64;
    }
  },

  insecureRandom () {
    return origRandom.insecureRandom();
  }
};

export function $fixRandomU64() {
  fixedRandomU64 = origRandom.getRandomU64();
  return fixedRandomU64;
}

export function $unfixRandomU64() {
  fixedRandomU64 = null;
}
