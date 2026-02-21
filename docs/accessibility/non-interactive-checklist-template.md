# Non-Interactive/Display Components Accessibility Checklist Template

Use this checklist for display-only components (`badge`, `alert`, `avatar`, `skeleton`, layout wrappers, etc.).

## Content Semantics

- [ ] Markup uses appropriate semantic structure (headings, lists, regions) when applicable.
- [ ] Decorative content is hidden from assistive tech (`aria-hidden`) when needed.
- [ ] Text alternatives exist for meaningful visuals/icons.

## Readability and Contrast

- [ ] Text contrast meets baseline accessibility requirements in default theme.
- [ ] Information is not conveyed by color alone.
- [ ] Typography and spacing support readability.

## Screen Reader Behavior

- [ ] Dynamic status/info content uses appropriate live-region pattern when needed.
- [ ] Landmark/region labeling is provided when component forms a distinct section.

## Responsive and Zoom

- [ ] Component remains understandable at 200% zoom.
- [ ] Content does not clip/truncate critical meaning at common breakpoints.

## Motion and Media

- [ ] Optional motion honors reduced-motion preferences where applicable.
- [ ] Media has alt/caption/transcript strategy where applicable.

## Test Matrix

- [ ] Semantic structure assertions
- [ ] Landmark/label assertions (if applicable)
- [ ] Contrast/manual visual QA notes
- [ ] Responsive/zoom QA notes
