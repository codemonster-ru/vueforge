const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
};

export const escapeChartHtml = (value: string): string =>
    value.replace(/[&<>"']/g, character => htmlEscapeMap[character]);

export const sanitizeChartText = (value: unknown): string => {
    const normalized = String(value ?? '').trim();
    return escapeChartHtml(normalized);
};
