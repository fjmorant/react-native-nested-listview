/**
 * Print the CHANGELOG entry for one version.
 *
 * GitHub's generated release notes are a list of merged pull requests, which
 * for this repository means a consumer reading the release sees "stop
 * setup-node's .npmrc breaking every yarn step" next to the reason the library
 * got faster. The CHANGELOG already says what changed and why; this hands that
 * text to `gh release create --notes-file` so the release and the file agree.
 *
 * Exits non-zero when the section is missing or empty, which is what makes it
 * useful as a release guard: a version nobody wrote a CHANGELOG entry for is
 * not ready to publish.
 */
import { readFile } from 'node:fs/promises';

const version = process.argv[2];

if (!version) {
  console.error('usage: changelog-section.mjs <version>');
  process.exit(2);
}

const changelog = await readFile(
  new URL('../CHANGELOG.md', import.meta.url),
  'utf8',
);
const lines = changelog.split('\n');
const heading = `## ${version}`;
const start = lines.findIndex((line) => line.trim() === heading);

if (start === -1) {
  console.error(`changelog-section: no "${heading}" in CHANGELOG.md`);
  process.exit(1);
}

let end = lines.length;

for (let i = start + 1; i < lines.length; i++) {
  if (lines[i].startsWith('## ')) {
    end = i;
    break;
  }
}

// The heading itself is dropped: the release already carries the version as
// its title, and repeating it reads like a mistake.
const body = lines.slice(start + 1, end).join('\n').trim();

if (!body) {
  console.error(`changelog-section: the "${heading}" section is empty`);
  process.exit(1);
}

console.log(body);
