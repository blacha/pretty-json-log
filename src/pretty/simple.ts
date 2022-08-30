import c from 'ansi-colors';
import { LogMessage, LogMessageFormatter, LogSkipLine } from '../msg.js';
import { OpenTelemetryLogs } from '../msg.open.telemetry.js';

function getLogStatus(level: number): string {
  if (level <= 10) return c.gray('TRACE');
  if (level <= 20) return c.magenta('DEBUG');
  if (level <= 30) return c.cyan('INFO');
  if (level <= 40) return c.yellow('WARN');
  if (level <= 50) return c.red('ERROR');
  return c.bgRed('FATAL');
}

export class PrettySimple implements LogMessageFormatter {
  /** Don't print these keys */
  static Ignore: Set<string> = new Set([
    // pino formats
    'pid',
    'time',
    'hostname',
    'level',
    'v',
    'name',
    'msg',
    // Open Telemetry Defaults
    'Timestamp',
    'SeverityText',
    'SeverityNumber',
  ]);

  /** minimum log level to print */
  level: number;
  constructor(level: number) {
    this.level = level;
  }

  public static formatObject(obj: Record<string, any>): string[] {
    const kvs = [];
    for (const key of Object.keys(obj)) {
      if (PrettySimple.Ignore.has(key)) continue;

      const value = obj[key];
      if (value == null || value === '') continue;

      let output = '';
      const typeofValue = typeof value;
      if (typeofValue === 'number') {
        output = c.yellow(String(value));
      } else if (typeofValue === 'string') {
        output = c.green(value);
      } else if (typeofValue === 'object') {
        const subOutput = this.formatObject(value);
        if (subOutput.length > 0) {
          output = `{ ${subOutput.join(' ')} }`;
        }
      } else {
        output = String(value);
      }

      if (output !== '') {
        kvs.push(`${c.dim(key)}=${output}`);
      }
    }
    return kvs;
  }

  pretty(msg: LogMessage): string | null | typeof LogSkipLine {
    const isOt = OpenTelemetryLogs.isOtLog(msg);
    const level = isOt ? OpenTelemetryLogs.normalizeLevel(msg.SeverityNumber) : msg.level;

    // Log is filtered out
    if (level < this.level) return LogSkipLine;

    const time = new Date(isOt ? msg.Timestamp : msg.time);
    if (isNaN(time.getTime())) return null;

    const kvs = PrettySimple.formatObject(msg);
    const kvString = kvs.join(' ');
    return `[${time.toISOString()}] ${getLogStatus(level)} ${c.blue(isOt ? String(msg.Body) : msg.msg)} ${kvString}`;
  }
}
