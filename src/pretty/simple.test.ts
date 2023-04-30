import assert from 'node:assert';
import { describe, it } from 'node:test';
import { LogSkipLine } from '../msg.js';
import { PrettySimple } from './simple.js';

describe('Simple', () => {
  it('should return null when below log level', () => {
    const simple = new PrettySimple(50);
    assert.equal(simple.pretty({ level: 49, time: 1, msg: 'abc' }), LogSkipLine);
    assert.notEqual(simple.pretty({ level: 50, time: 1, msg: 'abc' }), null);
    assert.notEqual(simple.pretty({ level: 51, time: 1, msg: 'abc' }), null);
  });

  it('should not pretty if time is not valid', () => {
    const simple = new PrettySimple(50);
    assert.equal(simple.pretty({ level: 50, time: 'abc', msg: 'abc' }), null);
  });
});
