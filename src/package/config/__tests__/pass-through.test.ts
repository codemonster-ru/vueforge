import { resolvePassThrough, withPartClass, type PassThroughOptions } from '../pass-through';

describe('pass-through contracts', () => {
    it('resolves static and functional part entries', () => {
        const pt: PassThroughOptions<{ active: boolean }> = {
            root: { 'data-test': 'root' },
            item: ({ active }) => ({ class: active ? 'is-active' : 'is-idle' }),
        };

        expect(resolvePassThrough(pt, 'root', { active: false })).toEqual({ 'data-test': 'root' });
        expect(resolvePassThrough(pt, 'item', { active: true })).toEqual({ class: 'is-active' });
    });

    it('returns empty attrs for missing parts and null resolver results', () => {
        const pt: PassThroughOptions<{ visible: boolean }> = {
            item: ({ visible }) => (visible ? { class: 'visible' } : null),
        };

        expect(resolvePassThrough(undefined, 'root', { visible: true })).toEqual({});
        expect(resolvePassThrough(pt, 'unknown', { visible: true })).toEqual({});
        expect(resolvePassThrough(pt, 'item', { visible: false })).toEqual({});
    });

    it('merges base class in styled mode and preserves attrs', () => {
        const attrs = withPartClass({ class: 'custom', role: 'button' }, 'vf-root', false);

        expect(attrs.role).toBe('button');
        expect(attrs.class).toEqual(['vf-root', 'custom']);
    });

    it('drops base class in unstyled mode', () => {
        expect(withPartClass({ class: 'custom' }, 'vf-root', true)).toEqual({ class: 'custom' });
        expect(withPartClass({}, 'vf-root', true)).toEqual({});
    });
});
