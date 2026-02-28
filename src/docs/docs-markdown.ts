import { resolveDocsSourcePathToRoute } from './docs-structure';

export type DocsHeading = {
    id: string;
    level: number;
    text: string;
};

export type DocsRenderedContent = {
    html: string;
    headings: DocsHeading[];
};

const escapeHtml = (value: string): string =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

const normalizePath = (value: string): string =>
    value
        .split('/')
        .reduce<string[]>((parts, part) => {
            if (!part || part === '.') {
                return parts;
            }

            if (part === '..') {
                parts.pop();
                return parts;
            }

            parts.push(part);
            return parts;
        }, [])
        .join('/');

const resolveRelativeMarkdownPath = (currentSourcePath: string, target: string): string | null => {
    if (!target) {
        return null;
    }

    if (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('mailto:')) {
        return target;
    }

    if (target.startsWith('#')) {
        return target;
    }

    if (target.startsWith('/docs/')) {
        return target;
    }

    const [rawTargetPath, hash] = target.split('#');
    const hasMarkdownExtension = rawTargetPath.toLowerCase().endsWith('.md');
    const resolvedPath = rawTargetPath.startsWith('/')
        ? normalizePath(rawTargetPath.replace(/^\/+/, ''))
        : normalizePath(`${currentSourcePath.split('/').slice(0, -1).join('/')}/${rawTargetPath}`);

    if (hasMarkdownExtension) {
        const sourcePath = resolvedPath.startsWith('docs/') ? resolvedPath : `docs/${resolvedPath}`;
        const route = resolveDocsSourcePathToRoute(sourcePath);
        if (!route) {
            return null;
        }
        return hash ? `${route}#${hash}` : route;
    }

    if (target.startsWith('/')) {
        return target;
    }

    return null;
};

const renderInline = (value: string, sourcePath: string): string => {
    const tokenPattern = /`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
    let cursor = 0;
    let html = '';

    for (const match of value.matchAll(tokenPattern)) {
        const fullMatch = match[0] ?? '';
        const index = match.index ?? 0;
        html += escapeHtml(value.slice(cursor, index));

        if (match[1]) {
            html += `<code>${escapeHtml(match[1])}</code>`;
        } else if (match[2] && match[3]) {
            const label = escapeHtml(match[2]);
            const resolvedHref = resolveRelativeMarkdownPath(sourcePath, match[3].trim());
            if (resolvedHref) {
                const isExternal = /^https?:\/\//.test(resolvedHref);
                const rel = isExternal ? ' rel="noopener noreferrer"' : '';
                const target = isExternal ? ' target="_blank"' : '';
                html += `<a href="${escapeHtml(resolvedHref)}"${target}${rel}>${label}</a>`;
            } else {
                html += label;
            }
        } else if (match[4]) {
            html += `<strong>${escapeHtml(match[4])}</strong>`;
        } else if (match[5]) {
            html += `<em>${escapeHtml(match[5])}</em>`;
        } else {
            html += escapeHtml(fullMatch);
        }

        cursor = index + fullMatch.length;
    }

    html += escapeHtml(value.slice(cursor));
    return html;
};

const stripFirstHeading = (markdown: string): string => {
    const lines = markdown.split(/\r?\n/);
    let stripped = false;
    const output: string[] = [];

    for (const line of lines) {
        if (!stripped && /^#\s+/.test(line.trim())) {
            stripped = true;
            continue;
        }

        output.push(line);
    }

    return output.join('\n');
};

const slugify = (value: string): string =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

export const renderDocsMarkdown = (markdown: string, sourcePath: string): DocsRenderedContent => {
    const lines = stripFirstHeading(markdown).split(/\r?\n/);
    const blocks: string[] = [];
    const headings: DocsHeading[] = [];
    const headingIdCounts = new Map<string, number>();
    let paragraphLines: string[] = [];
    let listType: 'ul' | 'ol' | null = null;
    let listItems: string[] = [];
    let codeFenceLanguage = '';
    let codeFenceLines: string[] = [];

    const flushParagraph = () => {
        if (!paragraphLines.length) {
            return;
        }
        const content = paragraphLines.join(' ');
        blocks.push(`<p>${renderInline(content, sourcePath)}</p>`);
        paragraphLines = [];
    };

    const flushList = () => {
        if (!listType || !listItems.length) {
            listType = null;
            listItems = [];
            return;
        }
        blocks.push(`<${listType}>${listItems.join('')}</${listType}>`);
        listType = null;
        listItems = [];
    };

    const flushCodeFence = () => {
        const className = codeFenceLanguage ? ` class="language-${escapeHtml(codeFenceLanguage)}"` : '';
        blocks.push(`<pre><code${className}>${escapeHtml(codeFenceLines.join('\n'))}</code></pre>`);
        codeFenceLanguage = '';
        codeFenceLines = [];
    };

    for (const rawLine of lines) {
        const line = rawLine.replace(/\t/g, '    ');
        const trimmed = line.trim();

        const fenceMatch = trimmed.match(/^```([\w-]+)?$/);
        if (fenceMatch) {
            flushParagraph();
            flushList();

            if (codeFenceLanguage || codeFenceLines.length) {
                flushCodeFence();
            } else {
                codeFenceLanguage = fenceMatch[1] ?? '';
                codeFenceLines = [];
            }
            continue;
        }

        if (codeFenceLanguage || codeFenceLines.length) {
            codeFenceLines.push(line);
            continue;
        }

        if (!trimmed) {
            flushParagraph();
            flushList();
            continue;
        }

        const headingMatch = trimmed.match(/^(#{2,6})\s+(.+)$/);
        if (headingMatch) {
            flushParagraph();
            flushList();
            const level = headingMatch[1].length;
            const headingText = headingMatch[2].trim();
            const slugBase = slugify(headingText) || `section-${headings.length + 1}`;
            const seen = headingIdCounts.get(slugBase) ?? 0;
            const id = seen === 0 ? slugBase : `${slugBase}-${seen + 1}`;
            headingIdCounts.set(slugBase, seen + 1);
            headings.push({ id, level, text: headingText });
            blocks.push(`<h${level} id="${escapeHtml(id)}">${renderInline(headingText, sourcePath)}</h${level}>`);
            continue;
        }

        if (/^---+$/.test(trimmed) || /^\*\*\*+$/.test(trimmed)) {
            flushParagraph();
            flushList();
            blocks.push('<hr />');
            continue;
        }

        const unorderedMatch = trimmed.match(/^[-*]\s+(.+)$/);
        if (unorderedMatch) {
            flushParagraph();
            if (listType && listType !== 'ul') {
                flushList();
            }
            listType = 'ul';
            listItems.push(`<li>${renderInline(unorderedMatch[1], sourcePath)}</li>`);
            continue;
        }

        const orderedMatch = trimmed.match(/^\d+\.\s+(.+)$/);
        if (orderedMatch) {
            flushParagraph();
            if (listType && listType !== 'ol') {
                flushList();
            }
            listType = 'ol';
            listItems.push(`<li>${renderInline(orderedMatch[1], sourcePath)}</li>`);
            continue;
        }

        const quoteMatch = trimmed.match(/^>\s?(.+)$/);
        if (quoteMatch) {
            flushParagraph();
            flushList();
            blocks.push(`<blockquote><p>${renderInline(quoteMatch[1], sourcePath)}</p></blockquote>`);
            continue;
        }

        paragraphLines.push(trimmed);
    }

    flushParagraph();
    flushList();
    if (codeFenceLanguage || codeFenceLines.length) {
        flushCodeFence();
    }

    return {
        html: blocks.join('\n'),
        headings,
    };
};
