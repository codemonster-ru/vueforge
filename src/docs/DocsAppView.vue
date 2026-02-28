<template>
    <div class="vf-docs" :class="`vf-docs_theme-${effectiveTheme}`" data-testid="vf-docs-app">
        <header class="vf-docs__header" data-testid="vf-docs-header">
            <RouterLink :to="firstDocsRoute" class="vf-docs__brand" aria-label="Go to docs home">
                <span class="vf-docs__logo" aria-hidden="true">VF</span>
                <strong class="vf-docs__brand-name">vueforge</strong>
            </RouterLink>
            <div class="vf-docs__header-controls">
                <input
                    id="vf-docs-search-input"
                    v-model="searchQuery"
                    data-testid="vf-docs-search"
                    class="vf-docs__search-input vf-docs__header-search-input"
                    type="search"
                    placeholder="Search docs pages"
                    aria-label="Search docs pages"
                />
                <ThemeModeSwitch
                    v-model="themeMode"
                    aria-label="Theme mode switch"
                    class="vf-docs__theme-switch"
                    data-testid="vf-docs-theme-switch"
                />
            </div>
            <button
                type="button"
                class="vf-docs__mobile-toggle"
                :aria-expanded="isMobileNavOpen ? 'true' : 'false'"
                aria-controls="vf-docs-mobile-nav"
                data-testid="vf-docs-mobile-toggle"
                @click="toggleMobileNav"
            >
                {{ isMobileNavOpen ? 'Close navigation' : 'Open navigation' }}
            </button>
        </header>

        <div class="vf-docs__layout">
            <aside ref="sidebarElement" class="vf-docs__sidebar" data-testid="vf-docs-sidebar">
                <PanelMenu
                    v-model:expanded-keys="sidebarExpandedKeys"
                    :items="sidebarMenuItems"
                    aria-label="Documentation sidebar"
                    :multiple="false"
                    :sync-active-from-route="false"
                    @item-click="onSidebarItemClick"
                />
            </aside>
            <div
                v-if="isMobileNavOpen"
                class="vf-docs__mobile-backdrop"
                data-testid="vf-docs-mobile-backdrop"
                @click="closeMobileNav"
            />
            <aside
                v-if="isMobileNavOpen"
                id="vf-docs-mobile-nav"
                class="vf-docs__mobile-drawer"
                data-testid="vf-docs-mobile-drawer"
                tabindex="-1"
                @keydown.esc="closeMobileNav"
            >
                <PanelMenu
                    v-model:expanded-keys="sidebarExpandedKeys"
                    :items="sidebarMenuItems"
                    aria-label="Documentation mobile sidebar"
                    :multiple="false"
                    :sync-active-from-route="false"
                    @item-click="onSidebarItemClick"
                />
            </aside>

            <main class="vf-docs__content" data-testid="vf-docs-content">
                <article class="vf-docs__article">
                    <Tabs
                        v-if="showComponentTabs"
                        v-model="activeComponentTab"
                        class="vf-docs__component-tabs"
                        aria-label="Component documentation sections"
                    >
                        <template #tabs>
                            <Tab v-for="tab in componentTabs" :key="tab.key" :value="tab.key" :label="tab.label" />
                            <Tab value="playground" label="Playground" />
                        </template>
                        <template #panels>
                            <TabPanel v-for="tab in componentTabs" :key="`panel-${tab.key}`" :value="tab.key">
                                <div class="vf-docs__body vf-docs__body_tabbed">
                                    <div class="vf-docs__main-column">
                                        <h2 class="vf-docs__title vf-docs__title_tab">
                                            {{ getComponentTabTitle(tab.key) }}
                                        </h2>
                                        <p
                                            v-if="tab.key === 'features' && showCurrentPageSummary"
                                            class="vf-docs__summary"
                                        >
                                            {{ currentPage.summary }}
                                        </p>
                                        <p v-if="tab.key === 'features'" class="vf-docs__source">
                                            Source: {{ currentPage.sourcePath }}
                                        </p>
                                        <div
                                            class="vf-docs__markdown"
                                            data-testid="vf-docs-markdown"
                                            :data-active-tab="activeComponentTab === tab.key ? 'true' : 'false'"
                                            v-html="tab.html"
                                        />
                                    </div>
                                    <aside
                                        v-if="activeComponentTab === tab.key && currentPageHeadings.length"
                                        class="vf-docs__toc"
                                        data-testid="vf-docs-toc"
                                    >
                                        <p class="vf-docs__toc-title">On this page</p>
                                        <ul class="vf-docs__toc-list">
                                            <li
                                                v-for="heading in currentPageHeadings"
                                                :key="heading.id"
                                                :class="{ 'vf-docs__toc-item_active': activeHeadingId === heading.id }"
                                            >
                                                <a :href="`#${heading.id}`" @click.prevent="onTocLinkClick(heading.id)">
                                                    {{ heading.text }}
                                                </a>
                                            </li>
                                        </ul>
                                    </aside>
                                </div>
                            </TabPanel>
                            <TabPanel value="playground">
                                <h2 class="vf-docs__title vf-docs__title_tab">
                                    {{ getComponentTabTitle('playground') }}
                                </h2>
                                <DocsLivePreview
                                    :route-path="currentPage.routePath"
                                    :page-title="currentPage.title"
                                    :markdown="currentPage.markdown"
                                />
                            </TabPanel>
                        </template>
                    </Tabs>
                    <div v-else class="vf-docs__body">
                        <div class="vf-docs__main-column">
                            <h2 class="vf-docs__title">{{ currentPage.title }}</h2>
                            <p v-if="showCurrentPageSummary" class="vf-docs__summary">{{ currentPage.summary }}</p>
                            <p class="vf-docs__source">Source: {{ currentPage.sourcePath }}</p>
                            <DocsLivePreview
                                :route-path="currentPage.routePath"
                                :page-title="currentPage.title"
                                :markdown="currentPage.markdown"
                            />
                            <div
                                class="vf-docs__markdown"
                                data-testid="vf-docs-markdown"
                                data-active-tab="true"
                                v-html="currentPageHtml"
                            />
                        </div>
                        <aside v-if="currentPageHeadings.length" class="vf-docs__toc" data-testid="vf-docs-toc">
                            <p class="vf-docs__toc-title">On this page</p>
                            <ul class="vf-docs__toc-list">
                                <li
                                    v-for="heading in currentPageHeadings"
                                    :key="heading.id"
                                    :class="{ 'vf-docs__toc-item_active': activeHeadingId === heading.id }"
                                >
                                    <a :href="`#${heading.id}`" @click.prevent="onTocLinkClick(heading.id)">
                                        {{ heading.text }}
                                    </a>
                                </li>
                            </ul>
                        </aside>
                    </div>
                    <nav class="vf-docs__pager" aria-label="Documentation page navigation">
                        <RouterLink
                            v-if="adjacentPages.previous"
                            :to="adjacentPages.previous.routePath"
                            class="vf-docs__pager-link"
                            data-testid="vf-docs-prev-link"
                        >
                            Previous: {{ adjacentPages.previous.title }}
                        </RouterLink>
                        <span v-else class="vf-docs__pager-link vf-docs__pager-link_disabled">Previous: n/a</span>

                        <RouterLink
                            v-if="adjacentPages.next"
                            :to="adjacentPages.next.routePath"
                            class="vf-docs__pager-link"
                            data-testid="vf-docs-next-link"
                        >
                            Next: {{ adjacentPages.next.title }}
                        </RouterLink>
                        <span v-else class="vf-docs__pager-link vf-docs__pager-link_disabled">Next: n/a</span>
                    </nav>
                </article>
            </main>
        </div>

        <footer class="vf-docs__footer" data-testid="vf-docs-footer">
            <p>
                &copy; {{ copyrightYearLabel }}
                <a href="https://codemonster.net" target="_blank" rel="noopener noreferrer">codemonster.net</a>
                All rights reserved
            </p>
            <p>
                Maintained by
                <a href="https://github.com/KolesnikovKirill" target="_blank" rel="noopener noreferrer"
                    >Kirill Kolesnikov</a
                >
            </p>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { LocationQueryRaw } from 'vue-router';
import { useRoute, useRouter } from 'vue-router';
import type { PanelMenuItem } from '@/package/components/panel-menu.vue';
import PanelMenu from '@/package/components/panel-menu.vue';
import Tab from '@/package/components/tab.vue';
import TabPanel from '@/package/components/tab-panel.vue';
import Tabs from '@/package/components/tabs.vue';
import ThemeModeSwitch from '@/package/components/theme-mode-switch.vue';
import { docsGroups, findDocsPageByPath, firstDocsRoute, getDocsAdjacentPages } from './docs-structure';
import { renderDocsMarkdown } from './docs-markdown';
import DocsLivePreview from './DocsLivePreview.vue';

type ComponentTabKey = 'features' | 'api' | 'theming' | 'pass-through';
type DocsTabKey = ComponentTabKey | 'playground';
type ScrollMode = 'auto' | 'smooth' | 'instant';
type ComponentTabItem = {
    key: ComponentTabKey;
    label: string;
    markdown: string;
    html: string;
    headings: Array<{ id: string; level: number; text: string }>;
};

const extractFirstParagraphText = (markdown: string): string => {
    const lines = markdown.split(/\r?\n/);
    let skippedTitle = false;
    const paragraph: string[] = [];
    let inCodeFence = false;

    for (const rawLine of lines) {
        const line = rawLine.replace(/\t/g, '    ');
        const trimmed = line.trim();

        if (!skippedTitle && /^#\s+/.test(trimmed)) {
            skippedTitle = true;
            continue;
        }

        if (/^```/.test(trimmed)) {
            inCodeFence = !inCodeFence;
            if (paragraph.length) {
                break;
            }
            continue;
        }

        if (inCodeFence) {
            continue;
        }

        if (!trimmed) {
            if (paragraph.length) {
                break;
            }
            continue;
        }

        if (
            /^(#{2,6})\s+/.test(trimmed) ||
            /^[-*]\s+/.test(trimmed) ||
            /^\d+\.\s+/.test(trimmed) ||
            /^>\s?/.test(trimmed)
        ) {
            if (paragraph.length) {
                break;
            }
            continue;
        }

        paragraph.push(trimmed);
    }

    return paragraph.join(' ').trim();
};

const splitComponentMarkdownSections = (markdown: string): Array<{ heading: string; markdown: string }> => {
    const lines = markdown.split(/\r?\n/);
    const sections: Array<{ heading: string; markdown: string }> = [];
    const preface: string[] = [];
    let currentHeading = '';
    let currentLines: string[] = [];
    let rootHeadingSkipped = false;

    const flushCurrentSection = () => {
        if (!currentHeading) {
            return;
        }
        sections.push({
            heading: currentHeading,
            markdown: currentLines.join('\n').trim(),
        });
        currentHeading = '';
        currentLines = [];
    };

    for (const rawLine of lines) {
        const line = rawLine;
        const trimmed = line.trim();

        if (!rootHeadingSkipped && /^#\s+/.test(trimmed)) {
            rootHeadingSkipped = true;
            continue;
        }

        const headingMatch = trimmed.match(/^##\s+(.+)$/);
        if (headingMatch) {
            flushCurrentSection();
            currentHeading = headingMatch[1].trim();
            currentLines = [line];
            continue;
        }

        if (currentHeading) {
            currentLines.push(line);
        } else {
            preface.push(line);
        }
    }

    flushCurrentSection();

    const prefaceMarkdown = preface.join('\n').trim();
    if (prefaceMarkdown) {
        sections.unshift({
            heading: 'preface',
            markdown: prefaceMarkdown,
        });
    }

    return sections.filter(section => section.markdown.trim().length > 0);
};

const resolveComponentTabKey = (heading: string): ComponentTabKey => {
    const normalized = heading.toLowerCase();

    if (normalized.includes('pass through') || normalized.includes('passthrough')) {
        return 'pass-through';
    }

    if (
        normalized.includes('props') ||
        normalized.includes('events') ||
        normalized.includes('slots') ||
        normalized.includes('emits') ||
        normalized.includes('exposes') ||
        normalized.includes('methods') ||
        normalized === 'api'
    ) {
        return 'api';
    }

    if (
        normalized.includes('theming') ||
        normalized.includes('theme') ||
        normalized.includes('token') ||
        normalized.includes('css')
    ) {
        return 'theming';
    }

    return 'features';
};
const isDocsTabKey = (value: string): value is DocsTabKey =>
    value === 'features' ||
    value === 'api' ||
    value === 'theming' ||
    value === 'pass-through' ||
    value === 'playground';

const parseRouteTabKey = (value: unknown): DocsTabKey | null => {
    if (typeof value !== 'string') {
        return null;
    }

    return isDocsTabKey(value) ? value : null;
};

const route = useRoute();
const router = useRouter();
const searchQuery = ref('');
const isMobileNavOpen = ref(false);
const activeHeadingId = ref('');
const themeMode = ref<'system' | 'light' | 'dark'>('system');
const systemTheme = ref<'light' | 'dark'>('light');
const expandedGroupKeys = ref<Array<string>>([]);
const activeComponentTab = ref<DocsTabKey>('features');
const skipNextTabHashCleanup = ref(false);
const initialScrollRestoration =
    typeof history !== 'undefined' && 'scrollRestoration' in history ? history.scrollRestoration : null;

const themeStorageKey = 'vueforge-docs-theme-mode';
const sidebarElement = ref<HTMLElement | null>(null);

const currentPath = computed(() => {
    const raw = String(route.path || firstDocsRoute);
    return raw === '/docs' ? firstDocsRoute : raw;
});

const currentPage = computed(() => findDocsPageByPath(currentPath.value));
const firstParagraphText = computed(() => extractFirstParagraphText(currentPage.value.markdown));
const showCurrentPageSummary = computed(() => {
    const summary = currentPage.value.summary.trim();
    if (!summary) {
        return false;
    }

    return summary !== firstParagraphText.value;
});
const adjacentPages = computed(() => getDocsAdjacentPages(currentPage.value.routePath));
const renderedContent = computed(() => renderDocsMarkdown(currentPage.value.markdown, currentPage.value.sourcePath));
const isComponentPage = computed(() => currentPage.value.groupKey === 'components' && !currentPage.value.isIndex);
const showComponentTabs = computed(() => isComponentPage.value);
const allowedComponentTabs = computed<Set<DocsTabKey>>(
    () => new Set<DocsTabKey>(['playground', ...componentTabs.value.map(tab => tab.key)]),
);
const componentTabs = computed<Array<ComponentTabItem>>(() => {
    if (!isComponentPage.value) {
        return [];
    }

    const buckets: Record<ComponentTabKey, string[]> = {
        features: [],
        api: [],
        theming: [],
        'pass-through': [],
    };

    for (const section of splitComponentMarkdownSections(currentPage.value.markdown)) {
        const key = resolveComponentTabKey(section.heading);
        buckets[key].push(section.markdown);
    }

    const orderedTabs: Array<{ key: ComponentTabKey; label: string }> = [
        { key: 'features', label: 'Features' },
        { key: 'api', label: 'API' },
        { key: 'theming', label: 'Theming' },
        { key: 'pass-through', label: 'Pass Through' },
    ];

    return orderedTabs
        .filter(tab => buckets[tab.key].length > 0)
        .map(tab => {
            const markdown = buckets[tab.key].join('\n\n');
            const rendered = renderDocsMarkdown(markdown, currentPage.value.sourcePath);

            return {
                key: tab.key,
                label: tab.label,
                markdown,
                html: rendered.html,
                headings: rendered.headings,
            };
        });
});
const activeComponentTabData = computed(() => {
    const active = componentTabs.value.find(tab => tab.key === activeComponentTab.value);
    return active ?? componentTabs.value[0] ?? null;
});
const currentPageHtml = computed(() => activeComponentTabData.value?.html ?? renderedContent.value.html);
const currentPageHeadings = computed(() => {
    if (showComponentTabs.value && activeComponentTab.value === 'playground') {
        return [];
    }

    const source = activeComponentTabData.value?.headings ?? renderedContent.value.headings;
    return source.filter(heading => heading.level <= 3);
});
const effectiveTheme = computed<'light' | 'dark'>(() =>
    themeMode.value === 'system' ? systemTheme.value : themeMode.value,
);
const currentYear = new Date().getFullYear();
const copyrightYearLabel = currentYear <= 2025 ? '2025' : `2025-${currentYear}`;

const filteredDocsGroups = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    if (!query) {
        return docsGroups;
    }

    return docsGroups
        .map(group => ({
            ...group,
            items: group.items.filter(item => item.title.toLowerCase().includes(query)),
        }))
        .filter(group => group.items.length > 0);
});

const toggleMobileNav = () => {
    isMobileNavOpen.value = !isMobileNavOpen.value;
};

const closeMobileNav = () => {
    isMobileNavOpen.value = false;
};

const scrollSidebarToActiveItem = (behavior: ScrollMode = 'auto') => {
    const container = sidebarElement.value;
    if (!container) {
        return;
    }

    const activeLinks = Array.from(container.querySelectorAll<HTMLElement>('.vf-panelmenu-node__link.is-active'));
    const activeTriggers = Array.from(container.querySelectorAll<HTMLElement>('.vf-panelmenu-node__trigger.is-active'));
    const activeItem = activeLinks.at(-1) ?? activeTriggers.at(-1) ?? null;
    if (!activeItem) {
        return;
    }

    const containerRect = container.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();
    const isVisible = itemRect.top >= containerRect.top && itemRect.bottom <= containerRect.bottom;

    if (!isVisible) {
        const itemTopWithinContainer = activeItem.offsetTop;
        const targetScrollTop = Math.max(
            0,
            itemTopWithinContainer - container.clientHeight / 2 + activeItem.offsetHeight / 2,
        );

        container.scrollTo({
            top: targetScrollTop,
            behavior,
        });
    }
};

const scheduleSidebarScrollToActiveItem = (behavior: ScrollMode = 'auto') => {
    void nextTick(() => {
        if (typeof window === 'undefined') {
            scrollSidebarToActiveItem(behavior);
            return;
        }

        window.requestAnimationFrame(() => {
            scrollSidebarToActiveItem(behavior);
        });
    });
};

const ensureExpandedGroup = (groupKey: string) => {
    if (expandedGroupKeys.value.length === 1 && expandedGroupKeys.value[0] === groupKey) {
        return;
    }

    expandedGroupKeys.value = [groupKey];
};

const sidebarMenuItems = computed<Array<PanelMenuItem>>(() =>
    filteredDocsGroups.value.map(group => ({
        key: group.key,
        label: group.title,
        items: group.items
            .filter(item => !(group.key === 'components' && item.isIndex))
            .map(item => ({
                key: item.routePath,
                label: getSidebarItemLabel(item.routePath, item.title),
                to: item.routePath,
                exact: true,
                active: currentPage.value.routePath === item.routePath,
            })),
    })),
);
const visibleGroupKeys = computed(() => filteredDocsGroups.value.map(group => group.key));
const sidebarExpandedKeys = computed<Array<string>>({
    get: () => (searchQuery.value.trim() ? visibleGroupKeys.value : expandedGroupKeys.value),
    set: value => {
        if (searchQuery.value.trim()) {
            return;
        }
        expandedGroupKeys.value = value;
    },
});

const onSidebarItemClick = (item?: PanelMenuItem) => {
    closeMobileNav();

    if (!showComponentTabs.value) {
        return;
    }

    if (item?.to && String(item.to) === route.path) {
        activeComponentTab.value = 'features';
    }
};

const getSidebarItemLabel = (routePath: string, title: string) => {
    if (routePath === '/docs/api-conventions') {
        return 'API Conventions';
    }

    return title;
};

const getComponentTabTitle = (tabKey: DocsTabKey) => {
    if (tabKey === 'features') {
        return currentPage.value.title;
    }

    const suffixMap: Record<Exclude<DocsTabKey, 'features'>, string> = {
        api: 'API',
        theming: 'Theming',
        'pass-through': 'Pass Through',
        playground: 'Playground',
    };

    return `${currentPage.value.title} ${suffixMap[tabKey as Exclude<DocsTabKey, 'features'>]}`;
};

const onTocLinkClick = (headingId: string) => {
    const target = document.getElementById(headingId);
    if (!target) {
        return;
    }

    activeHeadingId.value = headingId;
    target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
    });

    if (typeof window !== 'undefined' && typeof history.replaceState === 'function') {
        history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${headingId}`);
    }
};

const scrollToHashHeading = (behavior: ScrollMode = 'auto') => {
    const hash = String(route.hash || '').replace(/^#/, '');
    if (!hash) {
        return false;
    }

    const target = document.getElementById(hash);
    if (!target) {
        return false;
    }

    target.scrollIntoView({
        behavior,
        block: 'start',
    });

    return true;
};

const scheduleHashScroll = (behavior: ScrollMode = 'smooth') => {
    if (typeof window === 'undefined') {
        return;
    }

    let attempts = 0;
    const maxAttempts = 8;

    const tryScroll = () => {
        attempts += 1;
        const didScroll = scrollToHashHeading(behavior);

        if (!didScroll && attempts < maxAttempts) {
            window.requestAnimationFrame(tryScroll);
        }
    };

    window.requestAnimationFrame(tryScroll);
};

const updateActiveHeadingByHash = () => {
    const hash = String(route.hash || '').replace(/^#/, '');
    if (!hash) {
        activeHeadingId.value = '';
        return;
    }
    activeHeadingId.value = hash;
};

const syncActiveComponentTabByHash = () => {
    if (!showComponentTabs.value) {
        return;
    }

    const hash = String(route.hash || '').replace(/^#/, '');
    if (!hash) {
        return;
    }

    const targetTab = componentTabs.value.find(tab => tab.headings.some(heading => heading.id === hash));
    if (!targetTab || targetTab.key === activeComponentTab.value) {
        return;
    }

    skipNextTabHashCleanup.value = true;
    activeComponentTab.value = targetTab.key;
};

const updateActiveHeadingByScroll = () => {
    const activeMarkdownRoot = document.querySelector<HTMLElement>('.vf-docs__markdown[data-active-tab="true"]');
    const headings = activeMarkdownRoot ? Array.from(activeMarkdownRoot.querySelectorAll<HTMLElement>('h2, h3')) : [];
    if (!headings.length) {
        activeHeadingId.value = '';
        return;
    }

    const inView = headings
        .map(heading => ({ id: heading.id, top: heading.getBoundingClientRect().top }))
        .filter(item => item.top <= 140)
        .sort((left, right) => right.top - left.top);

    if (inView[0]?.id) {
        activeHeadingId.value = inView[0].id;
        return;
    }

    activeHeadingId.value = headings[0]?.id ?? '';
};

const refreshActiveHeading = async () => {
    await nextTick();
    syncActiveComponentTabByHash();
    await nextTick();
    updateActiveHeadingByHash();
    scheduleHashScroll('smooth');
    if (!activeHeadingId.value) {
        updateActiveHeadingByScroll();
    }
};

onMounted(() => {
    if (typeof history !== 'undefined' && 'scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    const savedTheme = localStorage.getItem(themeStorageKey);
    if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
        themeMode.value = savedTheme;
    }

    const mediaQuery =
        typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    systemTheme.value = mediaQuery?.matches ? 'dark' : 'light';
    const handleThemeChange = (event: MediaQueryListEvent) => {
        systemTheme.value = event.matches ? 'dark' : 'light';
    };

    mediaQuery?.addEventListener('change', handleThemeChange);

    void refreshActiveHeading();
    window.addEventListener('scroll', updateActiveHeadingByScroll, { passive: true });
    window.addEventListener('hashchange', updateActiveHeadingByHash);
    scheduleSidebarScrollToActiveItem();

    onBeforeUnmount(() => {
        mediaQuery?.removeEventListener('change', handleThemeChange);
    });
});

onBeforeUnmount(() => {
    if (typeof history !== 'undefined' && 'scrollRestoration' in history && initialScrollRestoration) {
        history.scrollRestoration = initialScrollRestoration;
    }

    window.removeEventListener('scroll', updateActiveHeadingByScroll);
    window.removeEventListener('hashchange', updateActiveHeadingByHash);
});

watch(
    () => route.path,
    () => {
        closeMobileNav();
        ensureExpandedGroup(currentPage.value.groupKey);
        activeComponentTab.value = parseRouteTabKey(route.query.tab) ?? 'features';
        void refreshActiveHeading();
        scheduleSidebarScrollToActiveItem();
    },
);

watch(
    () => currentPage.value.groupKey,
    groupKey => {
        ensureExpandedGroup(groupKey);
    },
    { immediate: true },
);

watch(themeMode, value => {
    localStorage.setItem(themeStorageKey, value);
});

watch(
    componentTabs,
    tabs => {
        if (!showComponentTabs.value) {
            return;
        }

        const allowed = new Set<DocsTabKey>(['playground', ...tabs.map(tab => tab.key)]);
        const routeTab = parseRouteTabKey(route.query.tab);

        if (routeTab && allowed.has(routeTab) && routeTab !== activeComponentTab.value) {
            activeComponentTab.value = routeTab;
            return;
        }

        if (allowed.has(activeComponentTab.value)) {
            return;
        }

        activeComponentTab.value = tabs[0]?.key ?? 'playground';
    },
    { immediate: true },
);

watch(
    () => route.hash,
    async () => {
        syncActiveComponentTabByHash();
        await nextTick();
        updateActiveHeadingByHash();
    },
    { immediate: true },
);

watch(
    () => route.query.tab,
    value => {
        if (!showComponentTabs.value) {
            return;
        }

        const routeTab = parseRouteTabKey(value);
        if (routeTab && allowedComponentTabs.value.has(routeTab) && routeTab !== activeComponentTab.value) {
            activeComponentTab.value = routeTab;
        }
    },
);

watch(activeComponentTab, tab => {
    if (!showComponentTabs.value || !allowedComponentTabs.value.has(tab)) {
        return;
    }

    const shouldKeepHash = skipNextTabHashCleanup.value;
    skipNextTabHashCleanup.value = false;

    const currentRouteTab = parseRouteTabKey(route.query.tab);
    const normalizedCurrent = currentRouteTab ?? 'features';
    const shouldClearHash = !shouldKeepHash && Boolean(route.hash);
    if (normalizedCurrent === tab && !shouldClearHash) {
        return;
    }

    const nextQuery: LocationQueryRaw = { ...route.query };
    if (tab === 'features') {
        delete nextQuery.tab;
    } else {
        nextQuery.tab = tab;
    }

    void router.replace({
        path: route.path,
        query: nextQuery,
        hash: shouldKeepHash ? route.hash : '',
    });

    void refreshActiveHeading();
});
</script>

<style scoped lang="scss">
.vf-docs {
    --vf-docs-bg: #f8fafc;
    --vf-docs-text: #0f172a;
    --vf-docs-surface: #ffffff;
    --vf-docs-surface-muted: #f8fafc;
    --vf-docs-border: #cbd5e1;
    --vf-docs-border-strong: #dbeafe;
    --vf-docs-muted-text: #64748b;
    --vf-docs-secondary-text: #334155;
    --vf-docs-link-text: #1e293b;
    --vf-docs-link-hover-bg: #e2e8f0;
    --vf-docs-link-active-bg: #dbeafe;
    --vf-docs-link-active-text: #075985;
    --vf-docs-accent: #0369a1;
    --vf-docs-accent-soft: #0f766e;
    --vf-docs-header-bg: rgba(248, 250, 252, 0.94);
    --vf-docs-overlay-backdrop: rgba(15, 23, 42, 0.35);
    --vf-docs-control-bg: #ffffff;
    --vf-docs-control-text: #0f172a;
    --vf-docs-control-border: #cbd5e1;
    --vf-docs-control-placeholder: #64748b;
    --vf-docs-inline-code-bg: #e2e8f0;
    --vf-docs-code-block-bg: #0f172a;
    --vf-docs-code-block-text: #e2e8f0;
    --vf-docs-blockquote-border: #7dd3fc;
    --vf-docs-blockquote-bg: rgba(186, 230, 253, 0.3);
    --vf-docs-pager-disabled-bg: #f1f5f9;
    --vf-docs-pager-disabled-text: #94a3b8;
    --vf-docs-preview-bg: linear-gradient(150deg, rgba(224, 242, 254, 0.75), rgba(236, 253, 245, 0.7));
    --vf-docs-preview-border: #bfdbfe;
    --vf-docs-preview-muted-text: #334155;
    --vf-docs-preview-controls-bg: rgba(255, 255, 255, 0.85);
    --vf-docs-preview-render-bg: rgba(255, 255, 255, 0.75);
    --vf-docs-heading-strong: #0f172a;
    --vf-docs-pager-hover-text: #0369a1;
    --vf-docs-logo-grad-start: #0284c7;
    --vf-docs-logo-grad-end: #0ea5e9;
    --vf-docs-logo-text: #e2e8f0;
    --vf-theme-mode-switch-background-color: var(--vf-docs-control-bg);
    --vf-theme-mode-switch-border-color: var(--vf-docs-control-border);
    --vf-theme-mode-switch-text-color: var(--vf-docs-control-text);
    --vf-theme-mode-switch-hover-background-color: var(--vf-docs-link-hover-bg);
    --vf-theme-mode-switch-active-background-color: var(--vf-docs-link-active-bg);
    --vf-theme-mode-switch-active-text-color: var(--vf-docs-link-active-text);
    --vf-theme-mode-switch-focus-ring-shadow: 0 0 0 2px rgba(56, 189, 248, 0.3);
    --vf-docs-header-height: 3.75rem;
    min-height: 100vh;
    display: grid;
    grid-template-rows: auto 1fr auto;
    background-color: var(--vf-docs-bg);
    color: var(--vf-docs-text);
    font-family: 'Avenir Next', 'Avenir', 'Segoe UI', sans-serif;
}

.vf-docs__header {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.4rem 1rem;
    border-bottom: 1px solid var(--vf-docs-border-strong);
    background-color: var(--vf-docs-header-bg);
    backdrop-filter: blur(8px);
    min-height: var(--vf-docs-header-height);
    box-sizing: border-box;
}

.vf-docs__header-controls {
    display: flex;
    align-items: flex-end;
    gap: 0.75rem;
    margin-left: auto;
}

.vf-docs__header-search-input {
    min-width: 220px;
    max-width: 320px;
}

.vf-docs__theme-switch {
    flex: 0 0 auto;
}

.vf-docs__brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: inherit;
    text-decoration: none;
}

.vf-docs__logo {
    display: grid;
    place-items: center;
    width: 2rem;
    height: 2rem;
    border-radius: 0.5rem;
    background: linear-gradient(135deg, var(--vf-docs-logo-grad-start), var(--vf-docs-logo-grad-end));
    color: var(--vf-docs-logo-text);
    font-size: 0.75rem;
    font-weight: 700;
}

.vf-docs__brand-name {
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.01em;
}

.vf-docs__mobile-toggle {
    display: none;
    border: 1px solid var(--vf-docs-control-border);
    border-radius: 0.55rem;
    background-color: var(--vf-docs-control-bg);
    color: var(--vf-docs-control-text);
    padding: 0.4rem 0.65rem;
    font-size: 0.8rem;
}

.vf-docs__layout {
    display: grid;
    grid-template-columns: 280px minmax(0, 1fr);
    position: relative;
    align-items: start;
}

.vf-docs__layout::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: calc(280px - 1px);
    width: 1px;
    background-color: var(--vf-docs-border-strong);
    z-index: 2;
    pointer-events: none;
}

.vf-docs__sidebar {
    padding: 2rem 1.25rem 1.25rem;
    background-color: var(--vf-docs-surface-muted);
    position: sticky;
    top: var(--vf-docs-header-height);
    max-height: calc(100vh - var(--vf-docs-header-height));
    overflow-y: auto;
}

.vf-docs__search-label {
    display: block;
    margin: 0 0 0.35rem;
    font-size: 0.75rem;
    color: var(--vf-docs-muted-text);
}

.vf-docs__search-input {
    width: 100%;
    border: 1px solid var(--vf-docs-control-border);
    border-radius: 0.45rem;
    padding: 0.45rem 0.55rem;
    font-size: 0.85rem;
    background-color: var(--vf-docs-control-bg);
    color: var(--vf-docs-control-text);
}

.vf-docs__search-input::placeholder {
    color: var(--vf-docs-control-placeholder);
}

.vf-docs__mobile-backdrop {
    position: fixed;
    inset: 0;
    z-index: 19;
    background-color: var(--vf-docs-overlay-backdrop);
}

.vf-docs__mobile-drawer {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 20;
    width: min(85vw, 360px);
    padding: 1rem;
    overflow-y: auto;
    border-right: 1px solid var(--vf-docs-control-border);
    background-color: var(--vf-docs-surface-muted);
}

.vf-docs__sidebar :deep(.vf-panelmenu) {
    border: 0;
    background-color: transparent;
    padding: 0;
    border-radius: 0;
    box-shadow: none;
}

.vf-docs__sidebar :deep(.vf-panelmenu-node__trigger),
.vf-docs__sidebar :deep(.vf-panelmenu-node__link) {
    color: var(--vf-docs-link-text);
    font-size: 0.9rem;
}

.vf-docs__sidebar :deep(.vf-panelmenu-node__trigger:not(:disabled)) {
    cursor: pointer;
}

.vf-docs__sidebar :deep(.vf-panelmenu-node__trigger:disabled) {
    cursor: not-allowed;
}

.vf-docs__sidebar :deep(.vf-panelmenu-node__chevron) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    text-align: center;
}

.vf-docs__sidebar :deep(.vf-panelmenu-node__trigger:hover),
.vf-docs__sidebar :deep(.vf-panelmenu-node__link:hover) {
    background-color: var(--vf-docs-link-hover-bg);
}

.vf-docs__sidebar :deep(.vf-panelmenu-node__trigger.is-active) {
    background-color: transparent;
    color: var(--vf-docs-text);
    font-weight: 600;
}

.vf-docs__sidebar :deep(.vf-panelmenu-node__link.is-active) {
    background-color: var(--vf-docs-link-active-bg);
    color: var(--vf-docs-link-active-text);
}

.vf-docs__mobile-drawer :deep(.vf-panelmenu) {
    border: 0;
    background-color: transparent;
    border-radius: 0;
    box-shadow: none;
}

.vf-docs__content {
    padding: 2rem;
}

.vf-docs__article {
    width: 100%;
    max-width: 1280px;
}

.vf-docs__body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 240px;
    align-items: start;
    gap: 1.5rem;
}

.vf-docs__main-column {
    min-width: 0;
}

.vf-docs__body_tabbed .vf-docs__toc {
    margin-top: var(--vf-tabs-gap, 0.75rem);
}

.vf-docs__title {
    margin: 0 0 1rem;
    font-size: clamp(1.6rem, 2.4vw, 2.2rem);
}

.vf-docs__summary {
    margin: 0;
    color: var(--vf-docs-secondary-text);
    line-height: 1.6;
}

.vf-docs__source {
    margin: 0.5rem 0 0;
    font-size: 0.8rem;
    color: var(--vf-docs-muted-text);
}

.vf-docs__markdown {
    margin-top: 1.5rem;
    color: var(--vf-docs-link-text);
    line-height: 1.65;
}

.vf-docs__component-tabs {
    margin-top: 0;
    width: 100%;
    --vf-tabs-panel-padding: 0;
    --vf-tabs-list-border-color: var(--vf-docs-border);
    --vf-tabs-tab-text-color: var(--vf-docs-secondary-text);
    --vf-tabs-tab-hover-background-color: transparent;
    --vf-tabs-tab-active-text-color: var(--vf-docs-text);
    --vf-tabs-tab-active-background-color: transparent;
    --vf-tabs-tab-active-border-color: var(--vf-docs-accent);
}

.vf-docs__component-tabs :deep(.vf-tab) {
    font-weight: 500;
}

.vf-docs__component-tabs :deep(.vf-tab:not(.vf-tab_active)) {
    opacity: 0.9;
}

.vf-docs__component-tabs :deep(.vf-tab:hover:not(.vf-tab_disabled):not(.vf-tab_active)) {
    border-bottom-color: color-mix(in srgb, var(--vf-docs-accent) 45%, transparent);
}

.vf-docs__component-tabs :deep(.vf-tab_active) {
    font-weight: 600;
}

.vf-docs__markdown :deep(h2),
.vf-docs__markdown :deep(h3),
.vf-docs__markdown :deep(h4),
.vf-docs__markdown :deep(h5),
.vf-docs__markdown :deep(h6) {
    margin: 1.5rem 0 0.75rem;
    line-height: 1.35;
    scroll-margin-top: calc(var(--vf-docs-header-height) + 1rem);
}

.vf-docs__markdown :deep(p) {
    margin: 0.75rem 0;
}

.vf-docs__markdown :deep(ul),
.vf-docs__markdown :deep(ol) {
    margin: 0.75rem 0 0.75rem 1.25rem;
    padding: 0;
}

.vf-docs__markdown :deep(li + li) {
    margin-top: 0.35rem;
}

.vf-docs__markdown :deep(code) {
    padding: 0.1rem 0.35rem;
    border-radius: 0.35rem;
    background-color: var(--vf-docs-inline-code-bg);
    font-size: 0.85em;
}

.vf-docs__markdown :deep(pre) {
    overflow-x: auto;
    margin: 1rem 0;
    padding: 0.9rem 1rem;
    border-radius: 0.7rem;
    border: 1px solid var(--vf-docs-border);
    background-color: var(--vf-docs-code-block-bg);
    color: var(--vf-docs-code-block-text);
}

.vf-docs__markdown :deep(pre code) {
    padding: 0;
    background: transparent;
    color: inherit;
}

.vf-docs__markdown :deep(a) {
    color: var(--vf-docs-accent);
}

.vf-docs__markdown :deep(blockquote) {
    margin: 1rem 0;
    padding: 0.65rem 0.9rem;
    border-left: 3px solid var(--vf-docs-blockquote-border);
    background-color: var(--vf-docs-blockquote-bg);
    border-radius: 0.35rem;
}

.vf-docs__markdown :deep(hr) {
    margin: 1.25rem 0;
    border: 0;
    border-top: 1px solid var(--vf-docs-border);
}

.vf-docs__toc {
    margin-top: 0;
    padding: 0.85rem;
    border: 1px solid var(--vf-docs-border);
    border-radius: 0.65rem;
    background-color: var(--vf-docs-surface);
    position: sticky;
    top: calc(var(--vf-docs-header-height) + 1rem);
}

.vf-docs__toc-title {
    margin: 0 0 0.5rem;
    font-size: 0.8rem;
    color: var(--vf-docs-secondary-text);
    font-weight: 600;
}

.vf-docs__toc-list {
    margin: 0;
    padding: 0;
    list-style: none;
}

.vf-docs__toc-list li {
    margin: 0;
}

.vf-docs__toc-list a {
    display: inline-block;
    margin: 0.2rem 0;
    font-size: 0.85rem;
    color: var(--vf-docs-muted-text);
    text-decoration: none;
}

.vf-docs__toc-list a:hover {
    color: var(--vf-docs-accent);
    text-decoration: underline;
}

.vf-docs__toc-item_active a {
    color: var(--vf-docs-accent);
    font-weight: 600;
}

.vf-docs__pager {
    margin-top: 1.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}

.vf-docs__pager-link {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 0.625rem;
    border: 1px solid var(--vf-docs-border);
    border-radius: 0.625rem;
    color: var(--vf-docs-text);
    text-decoration: none;
    font-size: 0.85rem;
    background-color: var(--vf-docs-surface);
}

.vf-docs__pager-link:hover {
    border-color: var(--vf-docs-link-active-bg);
    color: var(--vf-docs-pager-hover-text);
}

.vf-docs__pager-link_disabled {
    color: var(--vf-docs-pager-disabled-text);
    background-color: var(--vf-docs-pager-disabled-bg);
}

.vf-docs__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--vf-docs-border-strong);
    font-size: 0.85rem;
    color: var(--vf-docs-secondary-text);
    background-color: var(--vf-docs-surface-muted);
}

.vf-docs__footer p {
    margin: 0;
}

.vf-docs__footer a {
    color: var(--vf-docs-accent);
    text-decoration: none;
}

.vf-docs__footer a:hover {
    text-decoration: underline;
}

.vf-docs_theme-dark {
    --vf-docs-bg: #0f172a;
    --vf-docs-text: #e2e8f0;
    --vf-docs-surface: #0b1220;
    --vf-docs-surface-muted: rgba(15, 23, 42, 0.92);
    --vf-docs-border: #334155;
    --vf-docs-border-strong: #1e293b;
    --vf-docs-muted-text: #94a3b8;
    --vf-docs-secondary-text: #94a3b8;
    --vf-docs-link-text: #e2e8f0;
    --vf-docs-link-hover-bg: #1e293b;
    --vf-docs-link-active-bg: #1d4ed8;
    --vf-docs-link-active-text: #dbeafe;
    --vf-docs-accent: #7dd3fc;
    --vf-docs-accent-soft: #e2e8f0;
    --vf-docs-header-bg: rgba(15, 23, 42, 0.92);
    --vf-docs-overlay-backdrop: rgba(15, 23, 42, 0.35);
    --vf-docs-control-bg: #0f172a;
    --vf-docs-control-text: #e2e8f0;
    --vf-docs-control-border: #334155;
    --vf-docs-control-placeholder: #64748b;
    --vf-docs-inline-code-bg: #1e293b;
    --vf-docs-code-block-bg: #020617;
    --vf-docs-code-block-text: #e2e8f0;
    --vf-docs-blockquote-border: #22d3ee;
    --vf-docs-blockquote-bg: rgba(15, 23, 42, 0.7);
    --vf-docs-pager-disabled-bg: #111827;
    --vf-docs-pager-disabled-text: #64748b;
    --vf-docs-preview-bg: linear-gradient(145deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.88));
    --vf-docs-preview-border: #334155;
    --vf-docs-preview-muted-text: #94a3b8;
    --vf-docs-preview-controls-bg: rgba(2, 6, 23, 0.8);
    --vf-docs-preview-render-bg: rgba(2, 6, 23, 0.72);
    --vf-docs-heading-strong: #f1f5f9;
    --vf-docs-pager-hover-text: #67e8f9;
    --vf-docs-logo-grad-start: #0f3b7a;
    --vf-docs-logo-grad-end: #1553a6;
    --vf-docs-logo-text: #dbeafe;
}

.vf-docs_theme-dark .vf-docs__header,
.vf-docs_theme-dark .vf-docs__footer,
.vf-docs_theme-dark .vf-docs__sidebar,
.vf-docs_theme-dark .vf-docs__mobile-drawer {
    background-color: var(--vf-docs-surface-muted);
    border-color: var(--vf-docs-border-strong);
    color: var(--vf-docs-text);
}

.vf-docs_theme-dark .vf-docs__search-input,
.vf-docs_theme-dark .vf-docs__header-search-input {
    background-color: var(--vf-docs-control-bg);
    border-color: var(--vf-docs-control-border);
    color: var(--vf-docs-control-text);
}

.vf-docs_theme-dark .vf-docs__search-input::placeholder,
.vf-docs_theme-dark .vf-docs__header-search-input::placeholder {
    color: var(--vf-docs-control-placeholder);
}

.vf-docs_theme-dark .vf-docs__group-title,
.vf-docs_theme-dark .vf-docs__search-label,
.vf-docs_theme-dark .vf-docs__source,
.vf-docs_theme-dark .vf-docs__summary {
    color: var(--vf-docs-muted-text);
}

.vf-docs_theme-dark .vf-docs__title {
    color: var(--vf-docs-text);
}

.vf-docs_theme-dark .vf-docs__markdown {
    color: var(--vf-docs-secondary-text);
}

.vf-docs_theme-dark .vf-docs__markdown :deep(h2),
.vf-docs_theme-dark .vf-docs__markdown :deep(h3),
.vf-docs_theme-dark .vf-docs__markdown :deep(h4),
.vf-docs_theme-dark .vf-docs__markdown :deep(h5),
.vf-docs_theme-dark .vf-docs__markdown :deep(h6) {
    color: var(--vf-docs-heading-strong);
}

.vf-docs_theme-dark .vf-docs__markdown :deep(code) {
    background-color: var(--vf-docs-inline-code-bg);
    color: var(--vf-docs-code-block-text);
}

.vf-docs_theme-dark .vf-docs__markdown :deep(pre) {
    border-color: var(--vf-docs-border);
    background-color: var(--vf-docs-code-block-bg);
    color: var(--vf-docs-code-block-text);
}

.vf-docs_theme-dark .vf-docs__markdown :deep(a) {
    color: var(--vf-docs-accent);
}

.vf-docs_theme-dark .vf-docs__markdown :deep(blockquote) {
    border-left-color: var(--vf-docs-blockquote-border);
    background-color: var(--vf-docs-blockquote-bg);
}

.vf-docs_theme-dark .vf-docs__markdown :deep(hr) {
    border-top-color: var(--vf-docs-border);
}

.vf-docs_theme-dark .vf-docs__toc {
    background-color: var(--vf-docs-surface);
    border-color: var(--vf-docs-border);
}

.vf-docs_theme-dark .vf-docs__toc-title {
    color: var(--vf-docs-secondary-text);
}

.vf-docs_theme-dark .vf-docs__toc-list a {
    color: var(--vf-docs-muted-text);
}

.vf-docs_theme-dark .vf-docs__toc-item_active a {
    color: var(--vf-docs-accent);
}

.vf-docs_theme-dark .vf-docs__pager-link {
    background-color: var(--vf-docs-surface);
    border-color: var(--vf-docs-border);
    color: var(--vf-docs-text);
}

.vf-docs_theme-dark .vf-docs__pager-link:hover {
    border-color: var(--vf-docs-blockquote-border);
    color: var(--vf-docs-pager-hover-text);
}

.vf-docs_theme-dark .vf-docs__pager-link_disabled {
    background-color: var(--vf-docs-pager-disabled-bg);
    color: var(--vf-docs-pager-disabled-text);
}

.vf-docs_theme-dark :deep(.vf-docs-preview) {
    background: var(--vf-docs-preview-bg);
    border-color: var(--vf-docs-preview-border);
}

.vf-docs_theme-dark :deep(.vf-docs-preview__header h3) {
    color: var(--vf-docs-text);
}

.vf-docs_theme-dark :deep(.vf-docs-preview__header p),
.vf-docs_theme-dark :deep(.vf-docs-preview__component),
.vf-docs_theme-dark :deep(.vf-docs-preview__label),
.vf-docs_theme-dark :deep(.vf-docs-preview__state),
.vf-docs_theme-dark :deep(.vf-docs-preview__empty),
.vf-docs_theme-dark :deep(.vf-docs-preview__control label) {
    color: var(--vf-docs-preview-muted-text);
}

.vf-docs_theme-dark :deep(.vf-docs-preview__controls) {
    background-color: var(--vf-docs-preview-controls-bg);
    border-color: var(--vf-docs-preview-border);
}

.vf-docs_theme-dark :deep(.vf-docs-preview__render) {
    background-color: var(--vf-docs-preview-render-bg);
    border-color: var(--vf-docs-preview-border);
}

.vf-docs_theme-dark :deep(.vf-docs-preview__control input[type='text']),
.vf-docs_theme-dark :deep(.vf-docs-preview__control input[type='number']),
.vf-docs_theme-dark :deep(.vf-docs-preview__control select),
.vf-docs_theme-dark :deep(.vf-docs-preview__control textarea) {
    background-color: var(--vf-docs-control-bg);
    border-color: var(--vf-docs-control-border);
    color: var(--vf-docs-control-text);
}

@media (max-width: 960px) {
    .vf-docs__header-controls {
        margin-left: 0;
        width: 100%;
        order: 3;
    }

    .vf-docs__header-search-input {
        min-width: 0;
        max-width: none;
        flex: 1 1 auto;
    }

    .vf-docs__layout {
        grid-template-columns: 1fr;
    }

    .vf-docs__layout::before {
        display: none;
    }

    .vf-docs__sidebar {
        display: none;
    }

    .vf-docs__body {
        grid-template-columns: 1fr;
    }

    .vf-docs__toc {
        position: static;
    }

    .vf-docs__mobile-toggle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }
}

@media (max-width: 700px) {
    .vf-docs__header,
    .vf-docs__footer {
        flex-direction: column;
        align-items: flex-start;
    }

    .vf-docs__header-controls {
        flex-direction: column;
        align-items: stretch;
        width: 100%;
    }

    .vf-docs__theme-switch {
        align-self: flex-start;
    }
}
</style>
