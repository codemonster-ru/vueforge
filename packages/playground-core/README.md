# @codemonster-ru/vueforge-playground-core

Framework-agnostic core for Codemonster playground sessions.

## Features (MVP)

- File model: `files: Record<string, string>` and `entry`
- Runtime selection: `browser | remote`
- Browser runtime in sandboxed iframe (`html/css/js` + minimal `ts` transpilation)
- Session API: `createPlaygroundSession()`, `run()`, `updateFiles()`, `dispose()`
- Events: `onRun`, `onError`, `onConsole`

## API

```ts
import { createPlaygroundSession } from '@codemonster-ru/vueforge-playground-core';

const session = createPlaygroundSession({
  runtime: 'browser',
  iframe,
  files: {
    '/index.html': '<div id="app"></div>',
    '/main.js': 'document.getElementById("app").textContent = "Hello";'
  },
  entry: '/index.html'
});

session.onRun(() => console.log('run'));
session.onError((err) => console.error(err));
session.onConsole((event) => console.log(event));

session.run();
```

## Limitations

- TypeScript transpilation is intentionally minimal (single-file transpile).
- Import graph bundling is not handled in MVP browser runtime.
- Remote runtime is contract-only for now.
