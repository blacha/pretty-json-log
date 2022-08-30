/** Base log object every log object should have at minimum these three keys */
export interface LogMessagePino extends Record<string, unknown> {
  /** Log level */
  level: number;
  /** Time stamp either a ISO8601 string, timestamp number in ms or a Date */
  time: number | string | Date;
  /** Log message */
  msg: string;
}

/**
 * Open telemtry log data model
 * https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/logs/data-model.md
 */
export interface LogMessageOpenTelemetry {
  /** Time in ms if number, or nanoseconds if string */
  Timestamp: number | string;
  TraceId?: string;
  SpanId?: string;
  TraceFlags?: string;
  /** Number between 1-24 */
  SeverityNumber: number;
  SeverityText?: string;
  Name?: string;
  Body?: unknown;
  Resource?: Record<string, unknown>;
  Attributes?: Record<string, unknown>;
}

export type LogMessage = LogMessageOpenTelemetry | LogMessagePino;

export const LogSkipLine = Symbol('SkipLine');

export interface LogMessageFormatter {
  /**
   * Attempt to prettify a message
   *
   * @returns pretty message, null if prettyifying failed, SkipLine if line should be ignlred
   */
  pretty(message: LogMessage): string | null | typeof LogSkipLine;
}
