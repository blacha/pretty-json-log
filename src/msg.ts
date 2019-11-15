/** Base log object every log object should have at minimum these three keys */
export interface LogMessage extends Record<string, any> {
    /** Log level */
    level: number;
    /** Time stamp either a ISO8601 string or a timestamp number in ms */
    time: number | string;
    /** Log message */
    msg: string;
}

export interface LogMessageFormatter {
    /** Attempt to prettify the message
     * @returns pretty message, null if prettyifying failed
     */
    pretty(message: LogMessage): string | null;
}
