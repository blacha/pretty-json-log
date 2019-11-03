export interface LogMessage {
    level: number;
    time: number;
    msg: string;
}

export interface LogMessageFormatter {
    pretty(message: LogMessage): string | null;
}
