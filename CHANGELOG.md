# Changelog

## 0.15.0

First release since October 2022. The library itself is unchanged in behaviour;
everything here is about the toolchain and what gets published.

### Breaking

- **The published entrypoint is now compiled JavaScript.** `main` previously
  pointed at `src/index.ts`, so consumers were transpiling this library's
  TypeScript themselves. The package now ships compiled CommonJS and ESM builds
  with their own type declarations, and no longer publishes `src/`. Anything
  importing from `react-native-nested-listview/src/...` must import from the
  package root instead.
- **`react` is now declared as `>=17`** rather than `*`. The build compiles JSX
  with the automatic runtime, which requires `react/jsx-runtime`. The previous
  `*` claimed support for versions where that entrypoint does not exist.

### Fixed

- The test suite could not run on Node 18 or later. React Native 0.70's Jest
  setup assigned to `global.performance`, which became read-only, so both suites
  aborted before executing and reported 0% coverage.
- Tests exercised expand and collapse only in appearance. `fireEvent.press` is
  asynchronous in React Native Testing Library v14 and was not awaited, so
  assertions observed the tree from before the press — and `toBeDefined()`
  passes on the `null` that `queryByText` returns when it finds nothing. A
  mutation disabling toggling entirely used to fail 1 test of 16; it now fails 5.
- The published package contained a 358 KB `yarn-error.log`, `.vscode/`, shell
  scripts, every tooling config, and a `dist/` carrying compiled tests plus
  stale artefacts from a previous layout. 79 files and 468 KB became 33 and
  39 KB.
- `prettier-check` and `prettier-format` never checked any `.tsx` file. The glob
  `src/**/*.{ts, tsx}` contains a space, so it matched the extension `" tsx"`.
  Every component in this library is `.tsx`.
- Formatting had stopped being enforced by `yarn lint` when the ESLint config
  was replaced, because the new one disables formatting rules rather than
  enabling them.

### Changed

- React Native 0.70 to 0.87, React 18 to 19, TypeScript 4.8 to 5.9, Jest 29 to
  30, ESLint 8 to 9 with flat config.
- CI moved from CircleCI, which pinned Node 14 and had not run in years, to
  GitHub Actions on Node 22 and 24.
- Removed `VirtualizedList`'s `listKey` prop, which React Native 0.87 removed
  entirely — nested lists are now identified through context.
- Dropped deprecated dependencies: `@testing-library/jest-native`,
  `@types/react-native`, `metro-react-native-babel-preset`, `codecov`, and
  several unused ones.

### Added

- `check-build` verifies every emitted file parses as JavaScript. Resolution
  checks do not catch JSX left in the output — they report a clean result on a
  build that no runtime can load.
- `check-package` verifies entrypoints and types agree across CommonJS, ESM,
  node10, node16 and bundler resolution.

## 0.14.2 and earlier

See the [releases page](https://github.com/fjmorant/react-native-nested-listview/releases).
