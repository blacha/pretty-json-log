import c from 'ansi-colors';
import { LogMessage, LogMessageFormatter, LogMessageOpenTelemetry, LogMessagePino, LogSkipLine } from '../msg.js';
import { OpenTelemetryLogs } from '../msg.open.telemetry.js';

function getLogStatus(level: number): string {
  if (level <= 10) return c.gray('TRACE');
  if (level <= 20) return c.magenta('DEBUG');
  if (level <= 30) return c.cyan('INFO');
  if (level <= 40) return c.yellow('WARN');
  if (level <= 50) return c.red('ERROR');
  return c.bgRed('FATAL');
}

type LogObject = Record<string, unknown>;

export const PrettySimplePino = {
  Ignore: new Set<string>([
    // pino formats
    'pid',
    'time',
    'hostname',
    'level',
    'v',
    'name',
    'msg',
  ]),
  formatObject(obj: LogObject, prefix = ''): string[] {
    const kvs = [];
    for (const key of Object.keys(obj)) {
      if (PrettySimplePino.Ignore.has(key)) continue;

      const value = obj[key];
      if (value == null || value === '') continue;

      let output = '';
      const typeofValue = typeof value;
      if (typeofValue === 'number') {
        output = c.yellow(String(value));
      } else if (typeofValue === 'string') {
        output = c.green(value as string);
      } else if (typeofValue === 'object') {
        const subOutput = this.formatObject(value as LogObject, prefix);
        if (subOutput.length > 0) {
          output = `{ ${subOutput.join(' ')} }`;
        }
      } else {
        output = String(value);
      }

      if (output !== '') {
        kvs.push(`${prefix}${c.dim(key)}=${output}`);
      }
    }
    return kvs;
  },
  pretty(msg: LogMessagePino): string | null {
    const time = new Date(msg.time);
    if (isNaN(time.getTime())) return null;

    const kvs = this.formatObject(msg);
    const kvString = kvs.join(' ');
    return `[${time.toISOString()}] ${getLogStatus(msg.level)} ${c.blue(msg.msg)} ${kvString}`;
  },
};

const PrettySimpleOpenTelemetry = {
  Ignore: new Set(['Body', 'Timestamp', 'SeverityText', 'SeverityNumber']),

  formatTrace(msg: LogMessageOpenTelemetry): string {
    if (msg.TraceId == null) return '';
    const t = c.magentaBright('t.');
    const output = [`${t}${c.dim('trace.id')}=${msg.TraceId}`];

    if (msg.SpanId) output.push(`${t}${c.dim('trace.span')}=${msg.SpanId}`);
    if (msg.TraceFlags) output.push(`${t}${c.dim('trace.flags')}=${msg.TraceFlags}`);

    return output.join(' ');
  },

  pretty(msg: LogMessageOpenTelemetry, options?: PrettySimpleOptions): string | null {
    const time = OpenTelemetryLogs.normalizeTime(msg.Timestamp);
    if (isNaN(time.getTime())) return null;
    const level = OpenTelemetryLogs.normalizeLevel(msg.SeverityNumber);

    const resources = msg.Resource ? PrettySimplePino.formatObject(msg.Resource, c.redBright('r.')).join(' ') : '';
    const attrs = msg.Attributes ? PrettySimplePino.formatObject(msg.Attributes, c.cyanBright('a.')).join(' ') : '';
    const trace = this.formatTrace(msg);

    const suffix = [];
    if (trace) suffix.push(trace);
    if (resources && options?.ignoreResources !== true) suffix.push(resources);
    if (attrs) suffix.push(attrs);

    return `[${time.toISOString()}] ${getLogStatus(level)} ${c.blue(String(msg.Body))} ${suffix.join(' ')}`;
  },
};

export interface PrettySimpleOptions {
  /** Ignore Open Telemetry Resources key */
  ignoreResources?: boolean;
}

export class PrettySimple implements LogMessageFormatter {
  /** minimum log level to print */
  level: number;
  options: PrettySimpleOptions;
  constructor(level: number, options?: PrettySimpleOptions) {
    this.level = level;
    this.options = options ?? {};
  }

  pretty(msg: LogMessage): string | null | typeof LogSkipLine {
    const isOt = OpenTelemetryLogs.isOtLog(msg);
    const level = isOt ? OpenTelemetryLogs.normalizeLevel(msg.SeverityNumber) : msg.level;
    // Log is filtered out
    if (level < this.level) return LogSkipLine;

    if (isOt) return PrettySimpleOpenTelemetry.pretty(msg, this.options);
    return PrettySimplePino.pretty(msg);
  }
}
