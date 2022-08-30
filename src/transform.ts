import split from 'split2';
import { pipeline, Readable, Transform, TransformCallback, Writable, PassThrough } from 'stream';
import { StringDecoder } from 'string_decoder';
import { LogMessage, LogSkipLine } from './msg.js';
import { PrettySimple } from './pretty/simple.js';

function tryGetJson(data: string): null | Record<string, unknown> {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

function logError(err: NodeJS.ErrnoException | null): void {
  if (err == null) return;
  console.error('PrettyTransformFailed', err);
}

export class PrettyTransform extends Transform {
  decoder: StringDecoder;
  pretty: PrettySimple;

  /**
   * Create a writeable stream that will pretty print anything that is written to it onto the output stream
   *  @param output the destination stream
   */
  static stream(output: Writable = process.stdout, transform = new PrettyTransform()): PassThrough {
    const passThrough = new PassThrough();
    PrettyTransform.pretty(passThrough, output, transform);
    return passThrough;
  }

  /**
   * Pretty print all the output from source stream onto the output stream
   * @param source the source stream to read from
   * @param output the destination stream
   */
  static pretty(
    source: Readable,
    output: Writable = process.stdout,
    transform = new PrettyTransform(),
  ): PrettyTransform {
    pipeline(source, split(), transform, output, logError);
    return transform;
  }

  constructor() {
    super();
    this.pretty = new PrettySimple(-1); // Log everything passed
    this.decoder = new StringDecoder();
  }

  _transform(chunk: Buffer, encoding: string, callback: TransformCallback): void {
    if (encoding !== 'buffer') return callback(new Error(`Unknown encoding: ${encoding}`));

    const data = this.decoder.write(chunk);
    const json = tryGetJson(data);
    console.log('Line', data, json == null);
    if (json == null) return callback(null, chunk + '\n');

    const output = this.pretty.pretty(json as LogMessage);
    if (output === LogSkipLine) return callback(null, null);
    if (output == null) return callback(null, chunk + '\n');
    callback(null, output + '\n');
  }
}
