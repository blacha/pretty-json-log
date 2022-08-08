/** Base log object every log object should have at minimum these three keys */
export interface LogMessage extends Record<string, unknown> {
  /** Log level */
  level: number;
  /** Time stamp either a ISO8601 string, timestamp number in ms or a Date */
  time: number | string | Date;
  /** Log message */
  msg: string;
}

export const LogSkipLine = Symbol('SkipLine');

export interface LogMessageFormatter {
  /**
   * Attempt to prettify a message
   *
   * @returns pretty message, null if prettyifying failed, SkipLine if line should be ignlred
   */
  pretty(message: LogMessage): string | null | typeof LogSkipLine;
}
