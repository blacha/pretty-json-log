import chalk from 'chalk';
import { LogMessage, LogMessageFormatter } from '../msg';

function getLogStatus(level: number): string {
    if (level <= 10) {
        return chalk.gray('TRACE');
    }
    if (level <= 20) {
        return chalk.yellowBright('DEBUG');
    }
    if (level <= 30) {
        return chalk.cyan('INFO');
    }
    if (level <= 40) {
        return chalk.yellow('WARN');
    }
    if (level <= 50) {
        return chalk.red('ERROR');
    }
    return chalk.bgRed('FATAL');
}

export class PrettySimple implements LogMessageFormatter {
    /** Don't print these keys */
    ignore: { [key: string]: boolean } = {
        pid: true,
        time: true,
        hostname: true,
        level: true,
        v: true,
        name: true,
        msg: true,
    };

    /** minimum log level to print */
    level: number;
    constructor(level: number) {
        this.level = level;
    }

    private formatObject(obj: Record<string, any>): string[] {
        const kvs = [];
        for (const key of Object.keys(obj)) {
            if (this.ignore[key] === true) {
                continue;
            }

            const value = obj[key];
            if (value == null || value === '') {
                continue;
            }

            let output = '';
            const typeofValue = typeof value;
            if (typeofValue === 'number') {
                output = chalk.yellow(String(value));
            } else if (typeofValue === 'string') {
                output = chalk.green(value);
            } else if (typeofValue === 'object') {
                const subOutput = this.formatObject(value);
                if (subOutput.length > 0) {
                    output = `{ ${subOutput.join(', ')} }`;
                }
            } else {
                output = String(value);
            }

            if (output != '') {
                kvs.push(`${chalk.dim(key)}=${output}`);
            }
        }
        return kvs;
    }

    pretty(msg: LogMessage): string | null {
        if (msg.level < this.level) {
            return null;
        }

        const time = new Date(msg.time);
        if (isNaN(time.getTime())) {
            return null;
        }

        const kvs = this.formatObject(msg);
        const kvString = kvs.join(', ');
        return `[${time.toISOString()}] ${getLogStatus(msg.level)} ${chalk.blue(msg.msg)} ${kvString}`;
    }
}
