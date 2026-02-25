import type { Directive, DirectiveBinding } from 'vue';
import type { OverlayBadgeBinding } from '@/package/components/overlay-badge-utils';
import { resolveOverlayBadge } from '@/package/components/overlay-badge-utils';

const ROOT_CLASS = 'vf-overlay-badge-host';
const BADGE_CLASS = 'vf-overlay-badge__badge';
const BADGE_ATTRIBUTE = 'data-vf-overlay-badge';

type OverlayBadgeHost = HTMLElement & {
    __vfOverlayBadgeOriginalPosition__?: string | null;
};

const ensureRootPosition = (el: OverlayBadgeHost) => {
    if (window.getComputedStyle(el).position === 'static') {
        el.__vfOverlayBadgeOriginalPosition__ = el.style.position || null;
        el.style.position = 'relative';
    }
};

const restoreRootPosition = (el: OverlayBadgeHost) => {
    if (el.__vfOverlayBadgeOriginalPosition__ !== undefined) {
        if (el.__vfOverlayBadgeOriginalPosition__) {
            el.style.position = el.__vfOverlayBadgeOriginalPosition__;
        } else {
            el.style.removeProperty('position');
        }

        delete el.__vfOverlayBadgeOriginalPosition__;
    }
};

const ensureRootClass = (el: HTMLElement) => {
    el.classList.add(ROOT_CLASS);
};

const removeRootClass = (el: HTMLElement) => {
    el.classList.remove(ROOT_CLASS);
};

const ensureBadge = (el: HTMLElement) => {
    const existing = el.querySelector(`[${BADGE_ATTRIBUTE}]`);

    if (existing instanceof HTMLSpanElement) {
        return existing;
    }

    const badge = document.createElement('span');

    badge.className = BADGE_CLASS;
    badge.setAttribute(BADGE_ATTRIBUTE, 'true');
    badge.style.position = 'absolute';
    badge.style.pointerEvents = 'none';
    el.appendChild(badge);

    return badge;
};

const removeBadge = (el: HTMLElement) => {
    const badge = el.querySelector(`[${BADGE_ATTRIBUTE}]`);

    if (badge instanceof HTMLElement) {
        badge.remove();
    }
};

const applyPosition = (badge: HTMLElement, position: string) => {
    badge.dataset.position = position;

    badge.style.top = '';
    badge.style.right = '';
    badge.style.bottom = '';
    badge.style.left = '';
    badge.style.transform = '';

    if (position === 'top-left') {
        badge.style.top = 'var(--vf-overlay-badge-top-offset)';
        badge.style.left = 'var(--vf-overlay-badge-left-offset)';
        badge.style.transform = 'translate(-50%, -50%)';
        return;
    }
    if (position === 'bottom-right') {
        badge.style.bottom = 'var(--vf-overlay-badge-bottom-offset)';
        badge.style.right = 'var(--vf-overlay-badge-right-offset)';
        badge.style.transform = 'translate(50%, 50%)';
        return;
    }
    if (position === 'bottom-left') {
        badge.style.bottom = 'var(--vf-overlay-badge-bottom-offset)';
        badge.style.left = 'var(--vf-overlay-badge-left-offset)';
        badge.style.transform = 'translate(-50%, 50%)';
        return;
    }

    badge.style.top = 'var(--vf-overlay-badge-top-offset)';
    badge.style.right = 'var(--vf-overlay-badge-right-offset)';
    badge.style.transform = 'translate(50%, -50%)';
};

const applyAria = (badge: HTMLElement, ariaLabel: string) => {
    if (ariaLabel) {
        badge.removeAttribute('aria-hidden');
        badge.setAttribute('aria-label', ariaLabel);
    } else {
        badge.setAttribute('aria-hidden', 'true');
        badge.removeAttribute('aria-label');
    }
};

const applyBinding = (el: OverlayBadgeHost, bindingValue: OverlayBadgeBinding) => {
    const resolved = resolveOverlayBadge(bindingValue);

    if (!resolved.visible) {
        cleanup(el);
        return;
    }

    ensureRootClass(el);
    ensureRootPosition(el);

    const badge = ensureBadge(el);

    badge.style.zIndex = 'var(--vf-overlay-badge-z-index)';
    badge.style.minWidth = 'var(--vf-overlay-badge-min-size)';
    badge.style.height = 'var(--vf-overlay-badge-min-size)';
    badge.style.padding = '0 var(--vf-overlay-badge-padding-x)';
    badge.style.borderWidth = 'var(--vf-border-width)';
    badge.style.borderStyle = 'solid';
    badge.style.borderRadius = 'var(--vf-overlay-badge-border-radius)';
    badge.style.fontSize = 'var(--vf-overlay-badge-font-size)';
    badge.style.fontWeight = 'var(--vf-overlay-badge-font-weight)';
    badge.style.lineHeight = 'var(--vf-overlay-badge-line-height)';
    badge.style.display = 'inline-flex';
    badge.style.alignItems = 'center';
    badge.style.justifyContent = 'center';
    badge.style.whiteSpace = 'nowrap';

    badge.dataset.severity = resolved.severity;
    badge.dataset.dot = resolved.dot ? 'true' : 'false';
    badge.style.backgroundColor = `var(--vf-overlay-badge-${resolved.severity}-background-color, var(--vf-overlay-badge-background-color))`;
    badge.style.color = `var(--vf-overlay-badge-${resolved.severity}-text-color, var(--vf-overlay-badge-text-color))`;
    badge.style.borderColor = `var(--vf-overlay-badge-${resolved.severity}-border-color, var(--vf-overlay-badge-border-color))`;
    if (resolved.dot) {
        badge.style.width = 'var(--vf-overlay-badge-dot-size)';
        badge.style.minWidth = 'var(--vf-overlay-badge-dot-size)';
        badge.style.height = 'var(--vf-overlay-badge-dot-size)';
        badge.style.padding = '0';
    } else {
        badge.style.removeProperty('width');
        badge.style.minWidth = 'var(--vf-overlay-badge-min-size)';
        badge.style.height = 'var(--vf-overlay-badge-min-size)';
        badge.style.padding = '0 var(--vf-overlay-badge-padding-x)';
    }
    applyPosition(badge, resolved.position);
    applyAria(badge, resolved.ariaLabel);
    badge.textContent = resolved.dot ? '' : resolved.text;
};

const cleanup = (el: OverlayBadgeHost) => {
    removeBadge(el);
    removeRootClass(el);
    restoreRootPosition(el);
};

export const vOverlayBadge: Directive<HTMLElement, OverlayBadgeBinding> = {
    mounted(el: HTMLElement, binding: DirectiveBinding<OverlayBadgeBinding>) {
        applyBinding(el as OverlayBadgeHost, binding.value);
    },
    updated(el: HTMLElement, binding: DirectiveBinding<OverlayBadgeBinding>) {
        applyBinding(el as OverlayBadgeHost, binding.value);
    },
    unmounted(el: HTMLElement) {
        cleanup(el as OverlayBadgeHost);
    },
};
