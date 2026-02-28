export type DocsPage = {
    sourcePath: string;
    routePath: string;
    groupKey: string;
    groupTitle: string;
    title: string;
    summary: string;
    isIndex: boolean;
    markdown: string;
};

export type DocsGroup = {
    key: string;
    title: string;
    items: DocsPage[];
};

const GROUP_TITLES: Record<string, string> = {
    root: 'Getting Started',
    components: 'Components',
    guides: 'Guides',
    recipes: 'Recipes',
    accessibility: 'Accessibility',
    audits: 'Audits',
    contributing: 'Contributing',
    migrations: 'Migrations',
};

const GROUP_ORDER = [
    'root',
    'components',
    'guides',
    'recipes',
    'accessibility',
    'audits',
    'contributing',
    'migrations',
];

const markdownModules = import.meta.glob('../../docs/**/*.md', {
    eager: true,
    query: '?raw',
    import: 'default',
}) as Record<string, string>;

const toTitleCase = (value: string): string =>
    value
        .split(/[\s-_]+/)
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

const normalizeSegment = (segment: string): string => segment.trim().toLowerCase().replace(/_/g, '-');

const extractTitle = (markdown: string, fallback: string): string => {
    const heading = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim();
    return heading || fallback;
};

const extractSummary = (markdown: string, fallback: string): string => {
    const lines = markdown.split(/\r?\n/).map(line => line.trim());

    for (const line of lines) {
        if (!line || line.startsWith('#') || line.startsWith('```')) {
            continue;
        }

        if (line.startsWith('- ') || line.startsWith('* ') || /^\d+\.\s+/.test(line)) {
            continue;
        }

        return line;
    }

    return fallback;
};

const derivePages = (): DocsPage[] => {
    const pages: DocsPage[] = [];

    for (const [modulePath, markdown] of Object.entries(markdownModules)) {
        const normalizedPath = modulePath.replace(/\\/g, '/');
        const relativePath = normalizedPath.replace(/^.*\/docs\//, '');
        const withoutExt = relativePath.replace(/\.md$/i, '');
        const segments = withoutExt.split('/').filter(Boolean);

        if (!segments.length) {
            continue;
        }

        const fileName = segments[segments.length - 1] ?? '';
        const directorySegments = segments.slice(0, -1);
        const groupKey = directorySegments[0] ?? 'root';
        const groupTitle = GROUP_TITLES[groupKey] ?? toTitleCase(groupKey);

        const normalizedRouteSegments = segments
            .map(segment => normalizeSegment(segment))
            .filter(segment => segment && segment !== 'readme');
        const routePath = `/docs/${normalizedRouteSegments.join('/')}`.replace(/\/+$/g, '') || '/docs';

        const fallbackTitle =
            fileName.toLowerCase() === 'readme'
                ? toTitleCase(directorySegments[directorySegments.length - 1] ?? 'Documentation')
                : toTitleCase(fileName);

        const summaryFallback = `Documentation page from docs/${relativePath}`;

        pages.push({
            sourcePath: `docs/${relativePath}`,
            routePath,
            groupKey,
            groupTitle,
            title: extractTitle(markdown, fallbackTitle),
            summary: extractSummary(markdown, summaryFallback),
            isIndex: fileName.toLowerCase() === 'readme',
            markdown,
        });
    }

    return pages.sort((left, right) => {
        const leftGroupIndex = GROUP_ORDER.indexOf(left.groupKey);
        const rightGroupIndex = GROUP_ORDER.indexOf(right.groupKey);
        const safeLeftGroupIndex = leftGroupIndex === -1 ? Number.MAX_SAFE_INTEGER : leftGroupIndex;
        const safeRightGroupIndex = rightGroupIndex === -1 ? Number.MAX_SAFE_INTEGER : rightGroupIndex;

        if (safeLeftGroupIndex !== safeRightGroupIndex) {
            return safeLeftGroupIndex - safeRightGroupIndex;
        }

        if (left.groupKey !== right.groupKey) {
            return left.groupKey.localeCompare(right.groupKey);
        }

        if (left.isIndex !== right.isIndex) {
            return left.isIndex ? -1 : 1;
        }

        return left.routePath.localeCompare(right.routePath);
    });
};

export const docsPages = derivePages();

export const docsGroups: DocsGroup[] = docsPages.reduce<DocsGroup[]>((groups, page) => {
    const existing = groups.find(group => group.key === page.groupKey);

    if (existing) {
        existing.items.push(page);
        return groups;
    }

    groups.push({
        key: page.groupKey,
        title: page.groupTitle,
        items: [page],
    });

    return groups;
}, []);

export const docsRoutes = docsPages.map(page => page.routePath).filter(path => path !== '/docs');

export const firstDocsRoute = docsRoutes[0] ?? '/docs/browser-support';
export const firstComponentsRoute =
    docsPages.find(page => page.groupKey === 'components' && !page.isIndex)?.routePath ?? '/docs/components';

export const docsPageByRoute = new Map(docsPages.map(page => [page.routePath, page]));
export const docsPageBySourcePath = new Map(docsPages.map(page => [page.sourcePath, page]));

export const findDocsPageByPath = (path: string): DocsPage =>
    docsPageByRoute.get(path) ??
    docsPages[0] ?? {
        sourcePath: 'docs/browser-support.md',
        routePath: '/docs/browser-support',
        groupKey: 'root',
        groupTitle: 'Getting Started',
        title: 'Browser Support',
        summary: 'Documentation page',
        isIndex: false,
        markdown: '# Browser Support',
    };

export const getDocsAdjacentPages = (path: string): { previous: DocsPage | null; next: DocsPage | null } => {
    const index = docsPages.findIndex(page => page.routePath === path);

    if (index === -1) {
        return {
            previous: null,
            next: docsPages[0] ?? null,
        };
    }

    return {
        previous: docsPages[index - 1] ?? null,
        next: docsPages[index + 1] ?? null,
    };
};

export const resolveDocsSourcePathToRoute = (sourcePath: string): string | null =>
    docsPageBySourcePath.get(sourcePath)?.routePath ?? null;
