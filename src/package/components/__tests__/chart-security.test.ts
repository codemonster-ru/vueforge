import { describe, expect, it } from 'vitest';
import { escapeChartHtml, sanitizeChartText } from '../chart-security';

describe('chart security helpers', () => {
    it('escapes html-sensitive characters', () => {
        expect(escapeChartHtml('<script>alert("x")</script>')).toBe(
            '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;',
        );
    });

    it('normalizes and sanitizes untrusted text values', () => {
        expect(sanitizeChartText('  <b>Revenue</b>  ')).toBe('&lt;b&gt;Revenue&lt;/b&gt;');
        expect(sanitizeChartText(null)).toBe('');
    });
});
