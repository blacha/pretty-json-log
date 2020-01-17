import * as split from 'split2';
import { pipeline } from 'stream';
import { PrettyTransform } from './transform';

pipeline(process.stdin, split(), new PrettyTransform(), process.stdout, err => console.error(err));
