import { Transform, pipeline, TransformCallback } from 'stream';
import { StringDecoder } from 'string_decoder';
import * as split from 'split2';
import { PrettySimple } from './pretty/simple';

function getJson(data: any) {
    try {
        return JSON.parse(data);
    } catch {
        return null;
    }
}

class PrettyTransform extends Transform {
    decoder: StringDecoder;
    pretty: PrettySimple;

    constructor() {
        super();
        this.pretty = new PrettySimple(10);
        this.decoder = new StringDecoder();
    }

    _transform(chunk: any, encoding: string, callback: TransformCallback) {
        if (encoding !== 'buffer') {
            return callback(new Error(`Unknown encoding: ${encoding}`));
        }

        const data = this.decoder.write(chunk);
        const json = getJson(data);
        if (json == null) {
            return callback(null, chunk);
        }

        const output = this.pretty.pretty(json);
        if (output == null) {
            return callback(null, chunk);
        }
        callback(null, output + '\n');
    }
}

pipeline(process.stdin, split(), new PrettyTransform(), process.stdout, err => console.error(err));
