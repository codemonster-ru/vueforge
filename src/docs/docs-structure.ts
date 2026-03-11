import { reactive } from 'vue';

export type DocsPage = {
    sourcePath: string;
    routePath: string;
    groupKey: string;
    groupTitle: string;
    sidebarGroupKey: string;
    sidebarGroupTitle: string;
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
    core: 'Core',
    layouts: 'Layouts',
    guides: 'Guides',
    recipes: 'Recipes',
    accessibility: 'Accessibility',
    audits: 'Audits',
    contributing: 'Contributing',
    migrations: 'Migrations',
};

const GROUP_ORDER = [
    'root',
    'core',
    'layouts',
    'guides',
    'recipes',
    'accessibility',
    'audits',
    'contributing',
    'migrations',
];

const LAYOUT_COMPONENT_DOCS = new Set([
    'appbar',
    'appshell',
    'bottomnavigation',
    'breadcrumbs',
    'footer',
    'mainlayoutregion',
    'pagelayout',
    'pageheader',
    'navigationrail',
    'resizablesidebar',
    'splitlayout',
    'stickyregion',
    'systembar',
]);

const DOC_TITLE_OVERRIDES: Record<string, string> = {
    DOCS_TEMPLATE: 'Component Docs Template',
    'docs-template': 'Component Docs Template',
    README: 'Components Docs',
    'components/readme': 'Components Docs',
    'api-conventions': 'API Conventions (Cross-Library)',
    blockui: 'BlockUI',
    appbar: 'AppBar',
    appshell: 'AppShell',
    avatargroup: 'AvatarGroup',
    bottomnavigation: 'BottomNavigation',
    bulkactionbar: 'BulkActionBar',
    buttongroup: 'ButtonGroup',
    cascadeselect: 'CascadeSelect',
    colorpicker: 'ColorPicker',
    commentthread: 'CommentThread',
    confirmdialog: 'ConfirmDialog',
    confirmpopup: 'ConfirmPopup',
    datatable: 'DataTable',
    dataview: 'DataView',
    datepicker: 'DatePicker',
    daterangepicker: 'DateRangePicker',
    datetimepicker: 'DateTimePicker',
    defaultsprovider: 'DefaultsProvider',
    'dialogservice-confirmservice': 'DialogService / ConfirmService',
    diffviewer: 'DiffViewer',
    dynamicdialog: 'DynamicDialog',
    emptystate: 'EmptyState',
    'date-time-family-audit': 'Date/Time Family Accessibility Audit Framework',
    'disclosure-multistep-audit': 'Disclosure and Multi-Step Accessibility Audit',
    filterchips: 'FilterChips',
    floatlabel: 'FloatLabel',
    formfield: 'FormField',
    'headless-parity-matrix': 'Headless Parity Matrix (Key Components)',
    'iconfield-inputicon': 'IconField / InputIcon',
    'input-family-audit': 'Input Family Accessibility Audit Framework',
    'interactive-checklist-template': 'Interactive Components Accessibility Checklist Template',
    iftalabel: 'IftaLabel',
    infinitescroll: 'InfiniteScroll',
    inlineedit: 'InlineEdit',
    inlinemessage: 'InlineMessage',
    'input-shared-props': 'Input Shared Props Matrix',
    'inputgroup-inputaddon': 'InputGroup / InputAddon',
    jsonviewer: 'JSONViewer',
    localeprovider: 'LocaleProvider',
    mainlayoutregion: 'MainLayoutRegion',
    maskedinput: 'MaskedInput',
    megamenu: 'MegaMenu',
    menubar: 'MenuBar',
    metergroup: 'MeterGroup',
    multiselect: 'MultiSelect',
    navigationrail: 'NavigationRail',
    nossr: 'NoSsr',
    numberinput: 'NumberInput',
    orgchart: 'OrgChart',
    otpinput: 'OtpInput',
    overlaybadge: 'OverlayBadge',
    overlaypanel: 'OverlayPanel',
    pageheader: 'PageHeader',
    pagelayout: 'PageLayout',
    panelmenu: 'PanelMenu',
    passthrough: 'PassThrough',
    passwordinput: 'PasswordInput',
    picklist: 'PickList',
    'must-have-parity-a11y-regression': 'Must-have Parity A11y Regression',
    'must-have-parity-responsive-checks': 'Must-have Parity Responsive Checks',
    'must-have-parity-ssr-hydration': 'Must-have Parity SSR/Hydration Verification',
    'must-have-parity-theming-tokens': 'Must-have Parity Theming Tokens Coverage',
    'non-interactive-checklist-template': 'Non-Interactive/Display Components Accessibility Checklist Template',
    'radiogroup-radiobutton': 'RadioGroup / RadioButton',
    resizablesidebar: 'ResizableSidebar',
    'rbac-api-boundaries': 'RBAC API Boundaries',
    scrollpanel: 'ScrollPanel',
    scrolltop: 'ScrollTop',
    segmentedcontrol: 'SegmentedControl',
    'selection-family-audit': 'Selection Family Accessibility Audit Framework',
    'selection-state-conventions': 'Selection Family State Conventions',
    'selection-patterns': 'Selection Patterns',
    'selectioncontrol-selectioncontrolgroup': 'SelectionControl / SelectionControlGroup',
    'browser-support': 'Browser Support Matrix',
    'browser-compat-checks': 'Browser Compatibility Checks (Critical Components)',
    'show-hide': 'Show / Hide',
    'component-api-package-specs': 'Component API Package Specs',
    'component-breaking-change-rules': 'Component-Level Breaking Change Rules',
    'component-catalog-mapping': 'Component Catalog Mapping',
    'component-compliance-matrix': 'Component Compliance Matrix',
    'component-rollout-plan': 'Component Rollout Plan',
    'api-consistency-audit': 'API Consistency Audit',
    'api-consistency-contribution-guide': 'API Consistency Contribution Guide',
    contextmenu: 'ContextMenu',
    'date-time-locale-setup': 'Date/Time Locale Setup',
    'date-time-parsing-constraints': 'Date/Time Parsing And Constraints',
    'density-motion': 'Density and Motion Setup',
    'docs-ftp-deployment': 'Docs FTP Deployment Pipeline',
    'docs-build-artifact-strategy': 'Docs Build Artifact Strategy',
    'grid-griditem': 'Grid / GridItem',
    'i18n-rtl-setup': 'i18n and RTL Setup',
    'accordion-accordionitem': 'Accordion / AccordionItem',
    'layout-breakpoint-spacing-contracts': 'Layout Breakpoint and Spacing Contracts',
    MIGRATION_TEMPLATE: 'Migration Guide Template',
    'migration-template': 'Migration Guide Template',
    'api-normalization-notes': 'Migration Notes: API Normalization',
    'package-split': 'Package Split',
    'package-versioning': 'Package Versioning',
    'auth-page': 'Starter Recipe: Auth Page',
    'core-cookbook': 'Core Cookbook: Copy-Paste Recipes',
    'dashboard-page': 'Starter Recipe: Dashboard Page',
    'headless-unstyled-patterns': 'Recipe: Headless and Unstyled Patterns',
    'layout-analytics-shell': 'Layout Recipe: Analytics Shell',
    'layout-dashboard-shell': 'Layout Recipe: Dashboard Shell',
    'layout-mobile-adaptive-shell': 'Layout Recipe: Mobile Adaptive Shell',
    'layout-settings-shell': 'Layout Recipe: Settings Shell',
    'live-playground': 'Live Examples in Component Docs',
    'must-have-ops-workspace': 'Must-have Ops Workspace Recipe',
    orderlist: 'OrderList',
    'saas-i18n-timezone-validation': 'SaaS i18n and Timezone Validation',
    'saas-large-dataset-validation': 'SaaS Large-Dataset Validation',
    'settings-page': 'Starter Recipe: Settings Page',
    slidegroup: 'SlideGroup',
    snackbarqueue: 'SnackbarQueue',
    speeddial: 'SpeedDial',
    splitbutton: 'SplitButton',
    splitlayout: 'SplitLayout',
    'splitter-splitterpanel': 'Splitter / SplitterPanel',
    stickyregion: 'StickyRegion',
    systembar: 'SystemBar',
    tabmenu: 'TabMenu',
    'tabs-tab-tabpanel': 'Tabs / Tab / TabPanel',
    taginput: 'TagInput',
    thememodeswitch: 'ThemeModeSwitch',
    themeprovider: 'ThemeProvider',
    tieredmenu: 'TieredMenu',
    timepicker: 'TimePicker',
    'toast-toastcontainer': 'Toast / ToastContainer',
    togglebutton: 'ToggleButton',
    treeselect: 'TreeSelect',
    treetable: 'TreeTable',
    virtualscroller: 'VirtualScroller',
    'what-belongs-in-core-policy': 'What Belongs in Core Policy',
    'ssr-hydration-checks': 'SSR and Hydration Checks',
    'pass-through-unstyled': 'Pass-Through and Unstyled API',
    testing: 'Testing Expectations and Review Checklist',
};

const markdownModules = import.meta.glob('../../docs/**/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
}) as Record<string, string>;

const toTitleCase = (value: string): string =>
    value
        .split(/[\s-_]+/)
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

const normalizeSegment = (segment: string): string => segment.trim().toLowerCase().replace(/_/g, '-');

const getSidebarGroupKey = (groupKey: string, fileName: string): string => {
    if (groupKey !== 'components') {
        return groupKey;
    }

    const normalizedFileName = normalizeSegment(fileName.replace(/\.md$/i, ''));

    if (LAYOUT_COMPONENT_DOCS.has(normalizedFileName)) {
        return 'layouts';
    }

    return 'core';
};

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

const getFallbackTitle = (fileName: string, directorySegments: string[]): string => {
    const normalizedFileName = normalizeSegment(fileName.replace(/\.md$/i, ''));
    const scopedKey = directorySegments.length
        ? `${directorySegments.join('/')}/${normalizedFileName}`
        : normalizedFileName;

    if (DOC_TITLE_OVERRIDES[scopedKey]) {
        return DOC_TITLE_OVERRIDES[scopedKey];
    }

    if (normalizedFileName === 'readme') {
        return toTitleCase(directorySegments[directorySegments.length - 1] ?? 'Documentation');
    }

    return DOC_TITLE_OVERRIDES[normalizedFileName] ?? toTitleCase(fileName);
};

const markdownModulePaths = Object.keys(markdownModules);

const derivePages = (): DocsPage[] => {
    const pages: DocsPage[] = [];

    for (const modulePath of markdownModulePaths) {
        const markdown = markdownModules[modulePath] ?? '';
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
        const sidebarGroupKey = getSidebarGroupKey(groupKey, fileName);
        const sidebarGroupTitle = GROUP_TITLES[sidebarGroupKey] ?? toTitleCase(sidebarGroupKey);

        const normalizedRouteSegments = segments
            .map(segment => normalizeSegment(segment))
            .filter(segment => segment && segment !== 'readme');
        const routePath = `/docs/${normalizedRouteSegments.join('/')}`.replace(/\/+$/g, '') || '/docs';

        const fallbackTitle = getFallbackTitle(fileName, directorySegments);

        const summaryFallback = `Documentation page from docs/${relativePath}`;

        pages.push({
            sourcePath: `docs/${relativePath}`,
            routePath,
            groupKey,
            groupTitle,
            sidebarGroupKey,
            sidebarGroupTitle,
            title: markdown ? extractTitle(markdown, fallbackTitle) : fallbackTitle,
            summary: markdown ? extractSummary(markdown, summaryFallback) : summaryFallback,
            isIndex: fileName.toLowerCase() === 'readme',
            markdown,
        });
    }

    return pages.sort((left, right) => {
        const leftGroupIndex = GROUP_ORDER.indexOf(left.sidebarGroupKey);
        const rightGroupIndex = GROUP_ORDER.indexOf(right.sidebarGroupKey);
        const safeLeftGroupIndex = leftGroupIndex === -1 ? Number.MAX_SAFE_INTEGER : leftGroupIndex;
        const safeRightGroupIndex = rightGroupIndex === -1 ? Number.MAX_SAFE_INTEGER : rightGroupIndex;

        if (safeLeftGroupIndex !== safeRightGroupIndex) {
            return safeLeftGroupIndex - safeRightGroupIndex;
        }

        if (left.sidebarGroupKey !== right.sidebarGroupKey) {
            return left.sidebarGroupKey.localeCompare(right.sidebarGroupKey);
        }

        if (left.isIndex !== right.isIndex) {
            return left.isIndex ? -1 : 1;
        }

        return left.routePath.localeCompare(right.routePath);
    });
};

export const docsPages = reactive(derivePages()) as DocsPage[];

export const docsGroups: DocsGroup[] = docsPages.reduce<DocsGroup[]>((groups, page) => {
    const existing = groups.find(group => group.key === page.sidebarGroupKey);

    if (existing) {
        existing.items.push(page);
        return groups;
    }

    groups.push({
        key: page.sidebarGroupKey,
        title: page.sidebarGroupTitle,
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
        sidebarGroupKey: 'root',
        sidebarGroupTitle: 'Getting Started',
        title: 'Browser Support',
        summary: '',
        isIndex: false,
        markdown: '',
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
