import { renderDocsMarkdown, type DocsHeading } from './docs-markdown';

export type DocsFeatureExampleItem = {
    id: string;
    title: string;
    descriptionHtml: string;
    code: string;
    language: string;
};

export type DocsFeatureBlock =
    | {
          kind: 'markdown';
          html: string;
      }
    | {
          kind: 'examples';
          id: string;
          leadHtml: string;
          items: DocsFeatureExampleItem[];
      };

export type DocsFeatureRenderResult = {
    blocks: DocsFeatureBlock[];
    headings: DocsHeading[];
};

const slugify = (value: string): string =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

const createUniqueIdFactory = (existingIds: Iterable<string> = []) => {
    const seen = new Map<string, number>();

    for (const id of existingIds) {
        seen.set(id, (seen.get(id) ?? 0) + 1);
    }

    return (label: string, fallback: string): string => {
        const base = slugify(label) || fallback;
        const count = seen.get(base) ?? 0;
        seen.set(base, count + 1);
        return count === 0 ? base : `${base}-${count + 1}`;
    };
};

const findExamplesSection = (markdown: string): { before: string; body: string; after: string } | null => {
    const match = markdown.match(/^##\s+Examples\s*$/m);
    if (!match || match.index === undefined) {
        return null;
    }

    const start = match.index;
    const headingEnd = start + match[0].length;
    const remainder = markdown.slice(headingEnd);
    const nextSectionOffset = remainder.search(/\n##\s+/);
    const bodyEnd = nextSectionOffset >= 0 ? headingEnd + nextSectionOffset : markdown.length;

    return {
        before: markdown.slice(0, start).trim(),
        body: markdown.slice(headingEnd, bodyEnd).trim(),
        after: markdown.slice(bodyEnd).trim(),
    };
};

const parseExamplesSection = (
    markdown: string,
    sourcePath: string,
    createId: (label: string, fallback: string) => string,
): { block: DocsFeatureBlock; headings: DocsHeading[] } | null => {
    const lines = markdown.split(/\r?\n/);
    const leadLines: string[] = [];
    const pendingLines: string[] = [];
    const headings: DocsHeading[] = [];
    const items: DocsFeatureExampleItem[] = [];
    let currentTitle: string | null = null;
    let hasSeenExample = false;

    const flushPendingToLead = () => {
        if (!pendingLines.length) {
            return;
        }
        leadLines.push(...pendingLines);
        pendingLines.length = 0;
    };

    for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index];
        const trimmed = line.trim();
        const exampleHeadingMatch = trimmed.match(/^###\s+(.+)$/);
        if (exampleHeadingMatch) {
            if (!hasSeenExample && !currentTitle) {
                flushPendingToLead();
            }
            currentTitle = exampleHeadingMatch[1].trim();
            pendingLines.length = 0;
            continue;
        }

        const fenceMatch = trimmed.match(/^```([\w-]+)?$/);
        if (!fenceMatch) {
            pendingLines.push(line);
            continue;
        }

        const codeLines: string[] = [];
        let cursor = index + 1;
        while (cursor < lines.length && !lines[cursor].trim().startsWith('```')) {
            codeLines.push(lines[cursor]);
            cursor += 1;
        }

        const isFirstUnnamedExample = !hasSeenExample && !currentTitle;
        const descriptionMarkdown = isFirstUnnamedExample ? '' : pendingLines.join('\n').trim();
        if (isFirstUnnamedExample) {
            flushPendingToLead();
        }

        const title = currentTitle ?? (items.length === 0 ? 'Basic' : `Example ${items.length + 1}`);
        const id = createId(title, `example-${items.length + 1}`);
        const descriptionHtml = descriptionMarkdown ? renderDocsMarkdown(descriptionMarkdown, sourcePath).html : '';

        headings.push({
            id,
            level: 3,
            text: title,
        });
        items.push({
            id,
            title,
            descriptionHtml,
            code: codeLines.join('\n').trim(),
            language: fenceMatch[1] ?? '',
        });

        hasSeenExample = true;
        currentTitle = null;
        pendingLines.length = 0;
        index = cursor;
    }

    if (!items.length) {
        return null;
    }

    const examplesId = createId('Examples', 'examples');
    headings.unshift({
        id: examplesId,
        level: 2,
        text: 'Examples',
    });

    return {
        block: {
            kind: 'examples',
            id: examplesId,
            leadHtml: leadLines.length ? renderDocsMarkdown(leadLines.join('\n').trim(), sourcePath).html : '',
            items,
        },
        headings,
    };
};

export const renderDocsFeaturesMarkdown = (markdown: string, sourcePath: string): DocsFeatureRenderResult => {
    const section = findExamplesSection(markdown);
    if (!section) {
        const rendered = renderDocsMarkdown(markdown, sourcePath);
        return {
            blocks: [{ kind: 'markdown', html: rendered.html }],
            headings: rendered.headings,
        };
    }

    const blocks: DocsFeatureBlock[] = [];
    const headings: DocsHeading[] = [];

    if (section.before) {
        const renderedBefore = renderDocsMarkdown(section.before, sourcePath);
        blocks.push({
            kind: 'markdown',
            html: renderedBefore.html,
        });
        headings.push(...renderedBefore.headings);
    }

    const createId = createUniqueIdFactory(headings.map(heading => heading.id));
    const examplesResult = parseExamplesSection(section.body, sourcePath, createId);
    if (examplesResult) {
        blocks.push(examplesResult.block);
        headings.push(...examplesResult.headings);
    } else {
        const fallback = renderDocsMarkdown(`## Examples\n\n${section.body}`, sourcePath);
        blocks.push({
            kind: 'markdown',
            html: fallback.html,
        });
        headings.push(...fallback.headings);
    }

    if (section.after) {
        const renderedAfter = renderDocsMarkdown(section.after, sourcePath);
        blocks.push({
            kind: 'markdown',
            html: renderedAfter.html,
        });
        headings.push(...renderedAfter.headings);
    }

    return {
        blocks,
        headings,
    };
};
