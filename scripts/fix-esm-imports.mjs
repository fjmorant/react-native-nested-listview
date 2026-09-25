/**
 * Make the emitted ESM loadable by Node.
 *
 * TypeScript emits relative specifiers exactly as written in the source, and
 * this project imports directories (`./node-view`) as well as files
 * (`./types`). Node's ESM resolver accepts neither without a full path, so
 * every relative specifier is resolved against the emitted output and given
 * the extension it actually needs.
 *
 * Declaration files get the same treatment: under node16 resolution their
 * relative specifiers must carry extensions too, or the ESM types resolve as
 * CommonJS and the package "masquerades as CJS".
 *
 * Also drops a `package.json` marking the subtree as ESM, since the package
 * itself is CommonJS and Node would otherwise parse these files as CJS.
 */
import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const ESM_DIR = new URL('../dist/esm/', import.meta.url).pathname;

// `from './x'`, `import('./x')`, `export * from './x'`
const SPECIFIER = /((?:\bfrom\s*|\bimport\s*\(\s*))(['"])(\.\.?\/[^'"]*)\2/g;

async function* walk(dir) {
  for (const entry of await readdir(dir)) {
    const full = join(dir, entry);
    if ((await stat(full)).isDirectory()) yield* walk(full);
    else if (full.endsWith('.js') || full.endsWith('.d.ts')) yield full;
  }
}

function resolveSpecifier(file, spec) {
  if (spec.endsWith('.js')) return spec;
  const base = resolve(dirname(file), spec);
  if (existsSync(`${base}.js`)) return `${spec}.js`;
  if (existsSync(join(base, 'index.js'))) return `${spec}/index.js`;
  throw new Error(`cannot resolve "${spec}" from ${file}`);
}

let files = 0;
let rewrites = 0;

for await (const file of walk(ESM_DIR)) {
  const src = await readFile(file, 'utf8');
  const out = src.replace(SPECIFIER, (match, head, quote, spec) => {
    const fixed = resolveSpecifier(file, spec);
    if (fixed === spec) return match;
    rewrites++;
    return `${head}${quote}${fixed}${quote}`;
  });
  if (out !== src) {
    await writeFile(file, out);
    files++;
  }
}

// the package is CommonJS; this scopes the subtree as ESM
await writeFile(join(ESM_DIR, 'package.json'), `${JSON.stringify({ type: 'module' }, null, 2)}\n`);

console.log(`fix-esm-imports: ${rewrites} specifier(s) rewritten across ${files} file(s)`);
