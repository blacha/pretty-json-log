import o from 'ospec';
import { PrettySimple } from './simple';

o.spec('Simple', () => {
  o('should return null when below log level', () => {
    const simple = new PrettySimple(50);
    o(simple.pretty({ level: 49, time: 1, msg: 'abc' })).equals(null);
    o(simple.pretty({ level: 50, time: 1, msg: 'abc' })).notEquals(null);
    o(simple.pretty({ level: 51, time: 1, msg: 'abc' })).notEquals(null);
  });

  o('should not pretty if time is not valid', () => {
    const simple = new PrettySimple(50);
    o(simple.pretty({ level: 50, time: 'abc', msg: 'abc' })).equals(null);
  });
});
