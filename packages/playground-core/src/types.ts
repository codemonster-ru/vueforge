export type PlaygroundFiles = Record<string, string>;

export type RuntimeType = 'browser' | 'remote';

export type FrameworkType = 'vanilla' | 'vue' | 'html';

export interface PlaygroundError {
  message: string;
  stack?: string;
  source?: 'runtime' | 'transport' | 'internal';
}

export interface ConsoleEvent {
  level: 'log' | 'warn' | 'error' | 'info' | 'debug';
  args: unknown[];
  timestamp: number;
}

export interface RunEvent {
  entry: string;
  runtime: RuntimeType;
  framework?: FrameworkType;
}

export interface PlaygroundSession {
  run: () => Promise<void>;
  dispose: () => void;
  updateFiles: (nextFiles: PlaygroundFiles, nextEntry?: string) => void;
  onRun: (handler: (event: RunEvent) => void) => () => void;
  onError: (handler: (error: PlaygroundError) => void) => () => void;
  onConsole: (handler: (event: ConsoleEvent) => void) => () => void;
}

export interface RemoteRuntimeExecutor {
  execute: (payload: {
    files: PlaygroundFiles;
    entry: string;
    framework?: FrameworkType;
  }) => Promise<{ html?: string }>;
}

export interface CreatePlaygroundSessionOptions {
  runtime?: RuntimeType;
  framework?: FrameworkType;
  files: PlaygroundFiles;
  entry: string;
  iframe?: HTMLIFrameElement | null;
  remoteExecutor?: RemoteRuntimeExecutor;
}
