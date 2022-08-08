import { PrettyTransform } from './transform.js';

const transform = new PrettyTransform();

// Limit the logs to the specific level
const levelOffset = process.argv.indexOf('--level');
if (levelOffset > 0) {
  const levelRaw = process.argv[levelOffset + 1];
  const levelVal = Number(levelRaw);
  if (isNaN(levelVal) || levelVal < 0 || levelVal > 100) throw new Error('Invalid level value: ' + levelRaw);
  transform.pretty.level = levelVal;
}

/** Pretty print everything from stdin onto stdout */
PrettyTransform.pretty(process.stdin, process.stdout, transform);
