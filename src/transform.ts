import * as split from 'split2';
import { pipeline, Readable, Transform, TransformCallback, Writable, PassThrough } from 'stream';
import { StringDecoder } from 'string_decoder';
import { PrettySimple } from './pretty/simple';

function tryGetJson(data: any) {
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
  static stream(output: Writable = process.stdout) {
    const passThrough = new PassThrough();
    PrettyTransform.pretty(passThrough, output);
    return passThrough;
  }

  /**
   * Pretty print all the output from source stream onto the output stream
   * @param source the source stream to read from
   * @param output the destination stream
   */
  static pretty(source: Readable, output: Writable = process.stdout): PrettyTransform {
    const transform = new PrettyTransform();
    pipeline(source, split(), transform, output, logError);
    return transform;
  }

  constructor() {
    super();
    this.pretty = new PrettySimple(-1); // Log everything passed
    this.decoder = new StringDecoder();
  }

  _transform(chunk: any, encoding: string, callback: TransformCallback) {
    if (encoding !== 'buffer') {
      return callback(new Error(`Unknown encoding: ${encoding}`));
    }

    const data = this.decoder.write(chunk);
    const json = tryGetJson(data);
    if (json == null) {
      return callback(null, chunk + '\n');
    }

    const output = this.pretty.pretty(json);
    if (output == null) {
      return callback(null, chunk + '\n');
    }
    callback(null, output + '\n');
  }
}
