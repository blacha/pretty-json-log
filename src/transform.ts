import { Transform, TransformCallback } from 'stream';
import { StringDecoder } from 'string_decoder';
import { PrettySimple } from './pretty/simple';

function tryGetJson(data: any) {
    try {
        return JSON.parse(data);
    } catch {
        return null;
    }
}

export class PrettyTransform extends Transform {
    decoder: StringDecoder;
    pretty: PrettySimple;

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
