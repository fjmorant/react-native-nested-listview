/**
 * Syntax-check every emitted file.
 *
 * The published output is plain JavaScript, but the base tsconfig sets
 * `jsx: "react-native"`, which preserves JSX for Metro. If the build ever
 * loses its `jsx: "react-jsx"` override, dist ships JSX inside .js files and
 * nothing but a bundler can parse it. Resolution checks do not notice —
 * arethetypeswrong reports a clean bill of health on such a build — so this
 * parses each file instead.
 *
 * `node --check` needs no dependencies to be installed, so this works without
 * resolving react or react-native.
 */
import { readdir, stat } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { join } from 'node:path';
import { promisify } from 'node:util';

const run = promisify(execFile);
const DIST = new URL('../dist/', import.meta.url).pathname;

async function* walk(dir) {
  for (const entry of await readdir(dir)) {
    const full = join(dir, entry);
    if ((await stat(full)).isDirectory()) yield* walk(full);
    else if (full.endsWith('.js')) yield full;
  }
}

const failures = [];
let checked = 0;

for await (const file of walk(DIST)) {
  checked++;
  try {
    await run(process.execPath, ['--check', file]);
  } catch (error) {
    failures.push(`${file.replace(DIST, 'dist/')}\n${error.stderr.trim().split('\n').slice(0, 3).join('\n')}`);
  }
}

if (failures.length > 0) {
  console.error(`check-build: ${failures.length} of ${checked} emitted file(s) do not parse\n`);
  for (const f of failures) console.error(f, '\n');
  process.exit(1);
}

console.log(`check-build: all ${checked} emitted file(s) parse`);
