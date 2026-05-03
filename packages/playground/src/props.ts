import type { Component } from 'vue';
import type { FrameworkType, PlaygroundFiles } from '@codemonster-ru/vueforge-playground-core';

export interface VuePlaygroundProps {
  files: PlaygroundFiles;
  entry: string;
  framework?: FrameworkType;
  autorun?: boolean;
  showCode?: boolean;
  height?: number | string;
  theme?: 'light' | 'dark' | 'inherit';
  tabsRenderer?: Component;
  actionsRenderer?: Component;
  filesRenderer?: Component;
}
