# Changelog

## Unreleased

Replaces the recursive nested-`VirtualizedList` renderer with a flattened row
model (#469).

`node-view` rendered a `VirtualizedList` per node, recursively, so an N-level
tree nested N lists of the same orientation inside one another — the arrangement
React Native warns against. The tree is now flattened into a single array of
visible rows, rendered by one list. Depth is a number on a row rather than a
level of nesting in the component tree.

The props are unchanged and the exported surface — the default export,
`NestedRow` and `INode` — is unchanged.

### Breaking

- **`INode` now describes the node you pass in, not the node the list hands
  back.** It required `_internalId` — which the library assigns and a caller
  cannot know — so the only exported node type could not type the input:
  `const data: INode[] = [{title: 'x'}]` did not compile. `opened` and `hidden`
  are optional now, and a second exported type, **`IRenderedNode`**, describes
  what `renderNode` and `onNodePressed` receive, where `_internalId` is a
  `string` and `opened` a `boolean`, both guaranteed.

  Property *access* keeps compiling either way, because the index signature
  resolves any property to `any`. The narrowing is `opened` and `hidden` on an
  input node, which are now `boolean | undefined`. Typing a `renderNode`
  parameter as `IRenderedNode` gets the guarantees back, and gets them honestly —
  previously the required property and the index signature contradicted each
  other.

  `getChildrenName` and `keyExtractor` are now typed with `INode`, which is what
  they were already being called with. They claimed an `_internalId` that was
  not there.
- **`data` is typed `readonly INode[]`** rather than `any`, which is the point of
  having an input type.

### Changed

- **One list instead of one per node.** A 20,000-level-deep tree now mounts as
  few rows as a flat one; it previously mounted every node. Expanding and
  collapsing recomputes the row array rather than mounting and unmounting lists.
- **Nothing walks the tree on an ordinary render.** Ids were produced by hashing
  each node's entire subtree with `object-hash`, on a pass that depended on
  `data`, `extraData`, `renderNode`, `onNodePressed` and `getChildrenName`.
  Since `renderNode` and `onNodePressed` are inline arrows in every documented
  usage, the whole tree was re-hashed on every render of the parent. Only a
  change to `data` or `extraData` rebuilds the rows now.
- **Rows that did not move are no longer re-rendered.** A rebuild hands back the
  same row object where nothing about the node changed, so expanding a node
  re-renders the rows that appeared rather than every row on screen.
- The list is a `FlatList` rather than a bare `VirtualizedList`, which is what
  makes `ListComponent` interchangeable.

### Added

- **`ListComponent`**, the list used to render the rows. Because the rows are
  already flat, anything with a `FlatList`-shaped API works — `LegendList` or
  `FlashList`, to get their recycling.
- **`keyExtractor`**, to decide a node's identity within its parent.
- **`listProps`**, forwarded to the underlying list, which closes #451 — there
  was previously no way to reach the list at all, so something as ordinary as
  `showsVerticalScrollIndicator` was unreachable. Rather than adding a prop per
  option, the whole surface is now reachable.

  The merge order is defined and tested: `listProps` first, then `extraData`,
  `initialNumToRender` and `style` when they are given as their own props, then
  `data`, `renderItem` and `keyExtractor`, which the component controls and
  nothing can override. Those three are excluded from the `IListProps` type, so
  passing one is a compile error rather than a silent no-op.

  An absent `extraData`, `initialNumToRender` or `style` does **not** erase a
  value set through `listProps`, which the obvious implementation gets wrong.
- **`IRow` and `IListProps` are exported.** `ListComponent` shipped without a way
  to type the rows a custom list receives, which left it unusable from
  TypeScript.

### Fixed

- `initialNumToRender` only ever applied to the top level; the recursive
  `renderChildren` call omitted it. It now applies to the whole list.
- `style` was declared on the props but never used. It is applied to the list.
- Two nodes holding the same content shared an `_internalId`, because the id was
  a hash of content alone. They therefore shared one expansion state and one
  React key: expanding either expanded both. Ids are now paths, unique by
  construction.
- A node kept its expanded state across a change to `data` only when its content
  happened to be unchanged, since that content was its React key. State is now
  keyed by node identity, so a node stays expanded while its own content changes.

- The `NestedRow` props table documented a default `height` of **50**, which has
  never existed — the code applies `height ? {height} : {}`, so a row with no
  `height` sizes to its content. It also documented `level` as required when it
  defaults to `0`, marked `children` required when it is optional, and omitted
  `paddingLeftIncrement` entirely. The defaults are now documented as they are
  and covered by tests. `height` deliberately keeps having no default: adding one
  would resize every row in every app that omits it.

### Removed

- **The `object-hash` dependency.** The library now has no runtime dependencies.
- The undocumented `node-view` and `nodes-context-provider` internals. These were
  already unreachable from outside the package: the `exports` map has permitted
  only the package root since 0.15.0.

### Behaviour worth knowing about

- `_internalId` is now a path (`parent/child`) built from a node's own `id`, or
  failing that its `key`, or failing that its position, rather than a hash of the
  node's content. Do not persist these values across versions.
- **Top-level nodes are at `level` 1, not 0.** Inherited from the synthetic root
  node the old recursive renderer wrapped `data` in, and now kept on purpose
  rather than by accident: `NestedRow` indents by `level * paddingLeftIncrement`,
  so a 0 base would put top-level rows flush against the screen edge in every app
  built on the documented pattern. `TOP_LEVEL` is the single definition, and six
  tests fail if it changes. Pass `level - 1` for a flush edge.
- Expanded state now survives a change to `data` whenever a node's identity is
  unchanged, `keepOpenedState` or not. `keepOpenedState` still controls whether
  the state outlives the node leaving the tree — including while it sits inside a
  collapsed parent, which is when the recursive renderer used to discard it.

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
