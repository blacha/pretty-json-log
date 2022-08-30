import assert from 'assert';
import o from 'ospec';
import { OpenTelemetryLogs } from '../msg.open.telemetry.js';
import { OtMessage1, OtMessage2 } from './log.messages.js';

o.spec('OpenTelemetryLogFormat', () => {
  o('should guess a log is in ot format', () => {
    assert.equal(OpenTelemetryLogs.isOtLog(OtMessage1), true);
    assert.equal(OpenTelemetryLogs.isOtLog(OtMessage2), true);
  });

  o('should normalize numbers', () => {
    assert.equal(OpenTelemetryLogs.normalizeLevel(1), 10);
    assert.equal(OpenTelemetryLogs.normalizeLevel(2), 10);
    assert.equal(OpenTelemetryLogs.normalizeLevel(3), 10);
    assert.equal(OpenTelemetryLogs.normalizeLevel(4), 10);
    assert.equal(OpenTelemetryLogs.normalizeLevel(5), 20);
    assert.equal(OpenTelemetryLogs.normalizeLevel(6), 20);
    assert.equal(OpenTelemetryLogs.normalizeLevel(7), 20);
    assert.equal(OpenTelemetryLogs.normalizeLevel(8), 20);
    assert.equal(OpenTelemetryLogs.normalizeLevel(9), 30);
    assert.equal(OpenTelemetryLogs.normalizeLevel(10), 30);
    assert.equal(OpenTelemetryLogs.normalizeLevel(11), 30);
    assert.equal(OpenTelemetryLogs.normalizeLevel(12), 30);
    assert.equal(OpenTelemetryLogs.normalizeLevel(13), 40);
    assert.equal(OpenTelemetryLogs.normalizeLevel(14), 40);
    assert.equal(OpenTelemetryLogs.normalizeLevel(15), 40);
    assert.equal(OpenTelemetryLogs.normalizeLevel(16), 40);
    assert.equal(OpenTelemetryLogs.normalizeLevel(17), 50);
    assert.equal(OpenTelemetryLogs.normalizeLevel(18), 50);
    assert.equal(OpenTelemetryLogs.normalizeLevel(19), 50);
    assert.equal(OpenTelemetryLogs.normalizeLevel(20), 50);
    assert.equal(OpenTelemetryLogs.normalizeLevel(21), 60);
    assert.equal(OpenTelemetryLogs.normalizeLevel(22), 60);
    assert.equal(OpenTelemetryLogs.normalizeLevel(23), 60);
    assert.equal(OpenTelemetryLogs.normalizeLevel(24), 60);
  });

  o('should normalize numbers out of bounds', () => {
    assert.equal(OpenTelemetryLogs.normalizeLevel(-1), 10);
    assert.equal(OpenTelemetryLogs.normalizeLevel(0), 10);
    assert.equal(OpenTelemetryLogs.normalizeLevel(25), 60);
    assert.equal(OpenTelemetryLogs.normalizeLevel(26), 60);
    assert.equal(OpenTelemetryLogs.normalizeLevel(27), 60);
    assert.equal(OpenTelemetryLogs.normalizeLevel(28), 60);
    assert.equal(OpenTelemetryLogs.normalizeLevel(29), 60);
  });

  // Not strictly legit
  o('should normalize text out of bounds', () => {
    assert.equal(OpenTelemetryLogs.severityToText(-1), 'TRACE');
    assert.equal(OpenTelemetryLogs.severityToText(0), 'TRACE');
    assert.equal(OpenTelemetryLogs.severityToText(25), 'FATAL');
    assert.equal(OpenTelemetryLogs.severityToText(26), 'FATAL');
    assert.equal(OpenTelemetryLogs.severityToText(27), 'FATAL');
    assert.equal(OpenTelemetryLogs.severityToText(28), 'FATAL');
    assert.equal(OpenTelemetryLogs.severityToText(29), 'FATAL');
  });
  o('should normalize text', () => {
    assert.equal(OpenTelemetryLogs.severityToText(1), 'TRACE');
    assert.equal(OpenTelemetryLogs.severityToText(2), 'TRACE');
    assert.equal(OpenTelemetryLogs.severityToText(3), 'TRACE');
    assert.equal(OpenTelemetryLogs.severityToText(4), 'TRACE');
    assert.equal(OpenTelemetryLogs.severityToText(5), 'DEBUG');
    assert.equal(OpenTelemetryLogs.severityToText(6), 'DEBUG');
    assert.equal(OpenTelemetryLogs.severityToText(7), 'DEBUG');
    assert.equal(OpenTelemetryLogs.severityToText(8), 'DEBUG');
    assert.equal(OpenTelemetryLogs.severityToText(9), 'INFO');
    assert.equal(OpenTelemetryLogs.severityToText(10), 'INFO');
    assert.equal(OpenTelemetryLogs.severityToText(11), 'INFO');
    assert.equal(OpenTelemetryLogs.severityToText(12), 'INFO');
    assert.equal(OpenTelemetryLogs.severityToText(13), 'WARN');
    assert.equal(OpenTelemetryLogs.severityToText(14), 'WARN');
    assert.equal(OpenTelemetryLogs.severityToText(15), 'WARN');
    assert.equal(OpenTelemetryLogs.severityToText(16), 'WARN');
    assert.equal(OpenTelemetryLogs.severityToText(17), 'ERROR');
    assert.equal(OpenTelemetryLogs.severityToText(18), 'ERROR');
    assert.equal(OpenTelemetryLogs.severityToText(19), 'ERROR');
    assert.equal(OpenTelemetryLogs.severityToText(20), 'ERROR');
    assert.equal(OpenTelemetryLogs.severityToText(21), 'FATAL');
    assert.equal(OpenTelemetryLogs.severityToText(22), 'FATAL');
    assert.equal(OpenTelemetryLogs.severityToText(23), 'FATAL');
    assert.equal(OpenTelemetryLogs.severityToText(24), 'FATAL');
  });
});
