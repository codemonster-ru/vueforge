# Icon Style Guide

This library uses an original product-UI icon language with one active shipping style:

- `solid`: dense, compact silhouettes for primary UI actions

The target is deliberately close to established icon-pack discipline, but not to exact external contours or silhouettes.

## Core Rules

- Canvas: `512 x 512`
- Visual system: compact product icons with a strong `solid` base family
- Default optical padding: keep key shapes inside roughly `48..464`
- Corner language: rounded terminals and softened inner corners
- Rhythm: prefer 2-3 large masses over many small details
- Contrast: preserve recognizable silhouettes at `16px` and `20px`

## Shape System

- Directional icons use broad wedges or thick bent forms, not thin strokes
- Utility icons use circular or rounded-rect primitives where possible
- Handles, stems, and bars should feel related in weight
- Avoid tiny decorative cuts that disappear at small sizes
- `Solid` should read as one dominant silhouette first, internal detail second

## Consistency Targets

- `Solid` bars and dividers: roughly `52-60` units thick
- Circular utility forms: outer radius large, inner cut generous
- Chevron/check terminals: wide and readable rather than sharp
- Motion icons like refresh should favor one clear sweep and one clear arrowhead

## Originality Constraints

- Do not trace or reproduce third-party icon paths
- Do not mirror distinctive brand or logo silhouettes
- When inspired by common UI metaphors, rebuild proportions and negative space from scratch
- Prefer custom balance and corner treatment over “industry standard” clones
- It is acceptable to inherit a strong system feeling from major icon packs; it is not acceptable to recreate their exact outline logic icon-by-icon

## FA-like But Original

Use this library direction when redrawing the core pack:

- `Solid` should feel dense, compact, and product-ready
- Outer silhouette should dominate over decorative internals
- Counters and gaps should be short and controlled, not airy or spiky
- Avoid illustrative detail, asymmetrical noise, and accidental “sticker” shapes
- If an icon starts to resemble a traced FA shape too closely, step back and rebuild the proportion system

## Build Workflow

- Add or update icon components in `src/lib/components`
- Run `npm run build` to regenerate `src/lib/index.ts` and `src/lib/icons.json`
- Validate changes in the local showcase with `npm run dev`

## Visual QA Checklist

- Check the silhouette at `16px`, `20px`, and `24px`
- Confirm the icon is still identifiable without relying on tiny cuts or counters
- Verify the optical center feels balanced inside the `512 x 512` canvas
- Compare terminal roundness and bar thickness with neighboring icons
- Ensure negative space is not tighter than the rest of the set
- For directional icons, confirm arrowhead or caret direction reads instantly
- For circular icons, verify the ring thickness matches the rest of the family
- Avoid accidental visual references to well-known third-party icon shapes
