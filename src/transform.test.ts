import assert from 'node:assert';
import { describe, it } from 'node:test';

import { tryGetJson } from './transform.js';

describe('transform', () => {
  describe('tryGetJson', () => {
    it('returns null for invalid JSON', () => {
      assert.strictEqual(tryGetJson(''), null);
      assert.strictEqual(tryGetJson('foo'), null);
      assert.strictEqual(tryGetJson('{"foo":'), null);
      assert.strictEqual(tryGetJson('2024-01-01T19:53:58 {"foo":'), null);
      assert.strictEqual(tryGetJson('2024-01-01T19:53:58 {"foo": "bar"}}'), null);
    });

    it('returns the parsed JSON', () => {
      assert.deepStrictEqual(tryGetJson('{}'), {});
      assert.deepStrictEqual(tryGetJson('{"foo": "bar"}'), { foo: 'bar' });
      assert.deepStrictEqual(tryGetJson('2024-01-01T19:53:58 {"foo": "bar"}'), { foo: 'bar' });
      assert.deepStrictEqual(tryGetJson('2024-01-01T19:53:58 {"foo": "bar"} garbage'), { foo: 'bar' });
    });
  });
});
