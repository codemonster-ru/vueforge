import core from './presets/core';
import layouts from './presets/layouts';
import { composeThemePreset } from './presets/compose';

export const DefaultCoreTheme = core;
export const DefaultLayoutsTheme = layouts;

export default composeThemePreset(core, layouts);
