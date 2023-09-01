export namespace WasiIoStreams {
  export function read(this: InputStream, len: bigint): [Uint8Array, StreamStatus];
  export function blockingRead(this: InputStream, len: bigint): [Uint8Array, StreamStatus];
  export function dropInputStream(this: InputStream): void;
  export function write(this: OutputStream, buf: Uint8Array | ArrayBuffer): [bigint, StreamStatus];
  export function blockingWrite(this: OutputStream, buf: Uint8Array | ArrayBuffer): [bigint, StreamStatus];
  export function dropOutputStream(this: OutputStream): void;
}
export type InputStream = number;
/**
 * # Variants
 * 
 * ## `"open"`
 * 
 * ## `"ended"`
 */
export type StreamStatus = 'open' | 'ended';
export type OutputStream = number;
