import ts from 'typescript';

import type { PlaygroundError, PlaygroundFiles } from '../types';

const CONSOLE_BRIDGE_SCRIPT = `
<script>
(function(){
  var levels = ['log','info','warn','error','debug'];
  levels.forEach(function(level){
    var original = console[level];
    console[level] = function(){
      var args = Array.prototype.slice.call(arguments);
      try {
        parent.postMessage({
          __cm_playground: true,
          type: 'console',
          payload: { level: level, args: args, timestamp: Date.now() }
        }, '*');
      } catch (_) {}
      original.apply(console, args);
    };
  });

  window.addEventListener('error', function(event){
    parent.postMessage({
      __cm_playground: true,
      type: 'error',
      payload: {
        message: event.message || 'Runtime error',
        stack: event.error && event.error.stack,
        source: 'runtime'
      }
    }, '*');
  });

  window.addEventListener('unhandledrejection', function(event){
    var reason = event.reason || {};
    parent.postMessage({
      __cm_playground: true,
      type: 'error',
      payload: {
        message: reason.message || String(reason),
        stack: reason.stack,
        source: 'runtime'
      }
    }, '*');
  });
})();
</script>
`;

function transpileTs(content: string): string {
  return ts.transpileModule(content, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ESNext
    }
  }).outputText;
}

function replaceInlineTsScripts(html: string): string {
  return html.replace(
    /<script\s+type=["']text\/typescript["']\s*>([\s\S]*?)<\/script>/gi,
    (_, content: string) => `<script>${transpileTs(content)}</script>`
  );
}

function extractFile(files: PlaygroundFiles, path: string): string {
  return files[path] ?? '';
}

function normalizePath(path: string): string {
  const parts = path.split('/');
  const stack: string[] = [];
  for (const part of parts) {
    if (!part || part === '.') {
      continue;
    }
    if (part === '..') {
      stack.pop();
      continue;
    }
    stack.push(part);
  }
  return `/${stack.join('/')}`;
}

function resolveImportPath(fromFile: string, importPath: string): string {
  if (importPath.startsWith('/')) {
    return normalizePath(importPath);
  }
  const base = fromFile.slice(0, fromFile.lastIndexOf('/') + 1) || '/';
  return normalizePath(`${base}${importPath}`);
}

function stripCssImports(code: string, files: PlaygroundFiles, fromFile: string): { code: string; css: string } {
  const cssChunks: string[] = [];
  const cssImportRegex = /import\s+(?:[^'"]+?\s+from\s+)?["'](.+?\.css(?:\?[^"']*)?)["']\s*;?/g;

  const nextCode = code.replace(cssImportRegex, (match, importPathRaw: string) => {
    const importPath = String(importPathRaw).split('?')[0];
    const resolved = resolveImportPath(fromFile, importPath);
    const css = files[resolved];
    if (typeof css === 'string') {
      cssChunks.push(css);
      return '';
    }
    return match;
  });

  return {
    code: nextCode,
    css: cssChunks.join('\n')
  };
}

export function renderBrowserHtml(files: PlaygroundFiles, entry: string): { html: string; error?: PlaygroundError } {
  const source = extractFile(files, entry);

  if (!source) {
    return {
      html: '<!doctype html><html><body></body></html>',
      error: {
        message: `Entry file not found: ${entry}`,
        source: 'internal'
      }
    };
  }

  let html = source;

  if (!entry.endsWith('.html')) {
    const sourceJs = entry.endsWith('.ts') ? transpileTs(source) : source;
    const stripped = stripCssImports(sourceJs, files, entry);
    const css = [
      stripped.css,
      ...Object.entries(files)
      .filter(([filename]) => filename.endsWith('.css'))
      .map(([, code]) => code)
    ]
      .filter(Boolean)
      .join('\n');

    html = `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>${css}</style>
  </head>
  <body>
    <div id="app"></div>
    <script type="module">${stripped.code}</script>
  </body>
</html>`;
  }

  const withTs = replaceInlineTsScripts(html);

  if (withTs.includes('</head>')) {
    return { html: withTs.replace('</head>', `${CONSOLE_BRIDGE_SCRIPT}</head>`) };
  }

  if (withTs.includes('</body>')) {
    return { html: withTs.replace('</body>', `${CONSOLE_BRIDGE_SCRIPT}</body>`) };
  }

  return {
    html: `${withTs}${CONSOLE_BRIDGE_SCRIPT}`
  };
}

export function runInIframe(iframe: HTMLIFrameElement, html: string): void {
  iframe.setAttribute('sandbox', 'allow-scripts');
  iframe.srcdoc = html;
}
