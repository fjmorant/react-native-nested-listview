# react-native-nested-listview

UI component for React Native that allows to create a listview with N levels of nesting

![platforms](https://img.shields.io/badge/platforms-Android%20%7C%20iOS%20%7C%20Expo-brightgreen)
[![CI](https://github.com/fjmorant/react-native-nested-listview/actions/workflows/ci.yml/badge.svg)](https://github.com/fjmorant/react-native-nested-listview/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/fjmorant/react-native-nested-listview/branch/master/graph/badge.svg)](https://codecov.io/gh/fjmorant/react-native-nested-listview)
[![npm](https://img.shields.io/npm/v/react-native-nested-listview.svg?style=flat-square)](https://www.npmjs.com/package/react-native-nested-listview)
[![github release](https://img.shields.io/github/release/fjmorant/react-native-nested-listview.svg?style=flat-square)](https://github.com/fjmorant/react-native-nested-listview/releases)
[![CodeFactor](https://www.codefactor.io/repository/github/fjmorant/react-native-nested-listview/badge)](https://www.codefactor.io/repository/github/fjmorant/react-native-nested-listview)

## Table of contents

1. [Show](#show)
1. [Requirements](#requirements)
1. [Usage](#usage)
1. [Props](#props)
1. [Performance](#performance)
1. [Examples](#examples)
1. [Roadmap](#roadmap)
1. [Development](#development)

## Show

![react-native-nested-listview](https://i.imgur.com/Y3VFTry.gif)
![react-native-nested-listview](https://i.imgur.com/nJvl0ZT.gif)

## Requirements

| | |
| --- | --- |
| **React** | `>=17` — the package is compiled with the automatic JSX runtime, which needs `react/jsx-runtime` |
| **React Native** | no hard lower bound is declared. Verified against **0.86** and **0.87** |
| **New Architecture** | supported. Verified on React Native 0.86 via Expo SDK 57, where the New Architecture is the only one available |

This library is pure JavaScript with no runtime dependencies. It contains no
native modules, no `codegenConfig` and no iOS or Android sources, and builds only
on core components — `FlatList`, `Pressable`, `View`, `Text` and `StyleSheet` —
so it behaves the same under Fabric as under the legacy renderer. It also runs in
Expo Go.

The package ships compiled JavaScript with both CommonJS and ESM entrypoints and
its own type declarations. Nothing needs to be added to your Metro or Babel
configuration.

## Usage

```
yarn add react-native-nested-listview
```

```javascript
import NestedListView, {NestedRow} from 'react-native-nested-listview'

const data = [{title: 'Node 1', items: [{title: 'Node 1.1'}, {title: 'Node 1.2'}]}]

<NestedListView
  data={data}
  getChildrenName={(node) => 'items'}
  onNodePressed={(node) => alert('Selected node')}
  renderNode={(node, level, isLastLevel) => (
    <NestedRow
      level={level}
      style={styles.row}
    >
      <Text>{node.title}</Text>
    </NestedRow>
  )}
/>
```

## Props

### NestedListView

| Prop                     | Description                                                                                                                                                              | Type     | Default      |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | ------------ |
| **`data`**               | Array of nested items                                                                                                                                                    | `INode[]` | **Required** |
| **`renderNode`**         | Takes a node from data and renders it into the NestedlistView. The function receives `(node, level, isLastLevel)` as positional arguments (see [Usage](#usage)) and must return a React element. The node is an `IRenderedNode`, and `level` is 1 for the nodes of `data` and grows with depth. | Function | **Required** |
| **`getChildrenName`**    | Function to determine in a node where are the children, by default NestedListView will try to find them in **items**                                                     | Function | **items**    |
| **`onNodePressed`**      | Function called when a node is pressed by a user                                                                                                                         | Function | Not required |
| **`extraData`**          | A marker property for telling the list to re-render                                                                                                                      | Boolean  | Not required |
| **`keepOpenedState`**    | Prop for keeping the opened state of each node when data passed to the list changes                                                                                      | Boolean  | Not required |
| **`initialNumToRender`** | Prop for setting the initial amount of items to render.                                                                                                                  | number   | Not required |
| **`keyExtractor`**       | Identity of a node within its parent, used to keep expanded state attached to the right node when `data` changes. See [Node identity](#node-identity). | Function | node's `id`, then `key`, then position |
| **`ListComponent`**      | The list used to render the rows. Anything with a `FlatList`-shaped API works. See [Using another list](#using-another-list). | Component | `FlatList` |
| **`listProps`**          | Props forwarded to the underlying list — the scroll indicator, `onEndReached`, `refreshControl` and the rest of its surface. See [Reaching the list](#reaching-the-list). | `IListProps` | Not required |

### Reaching the list

`listProps` is forwarded to the underlying list, which is how you reach anything
on its surface:

```javascript
<NestedListView
  data={data}
  renderNode={renderNode}
  listProps={{
    showsVerticalScrollIndicator: false,
    onEndReached: loadMore,
  }}
/>
```

Three groups of props reach the list, applied in this order:

| Order | What | Notes |
| --- | --- | --- |
| 1 | `listProps` | everything you pass, applied first |
| 2 | `extraData`, `initialNumToRender`, `style` | their own props, which win over `listProps` — but **only when you actually pass them**, so a value set through `listProps` is never erased by an absent prop |
| 3 | `data`, `renderItem`, `keyExtractor` | set by the component and not overridable. They are excluded from `IListProps`, so passing one is a compile error rather than a silent no-op |

`initialNumToRender` therefore has two spellings. Its own prop predates
`listProps` and stays supported; `listProps.initialNumToRender` is equivalent,
and the dedicated prop wins if you set both.

`IListProps` is typed against `FlatList`, the default. Another `ListComponent`
with props of its own may need a cast.

### NestedRow

| Prop                       | Description                                                                     | Type                   | Default                                   |
| -------------------------- | ------------------------------------------------------------------------------- | ---------------------- | ----------------------------------------- |
| **`children`**             | Content of the row                                                              | `ReactNode`            | Not required                              |
| **`level`**                | Nesting depth, used to indent the row. Pass the `level` given to `renderNode`    | number                 | `0`                                       |
| **`paddingLeftIncrement`** | Left padding added per level, in pixels                                         | number                 | `10`                                      |
| **`height`**               | Fixed height for the row                                                        | number                 | Not required — the row sizes to its content |
| **`style`**                | Row container style                                                             | `StyleProp<ViewStyle>` | Not required                              |

#### Why levels start at 1

The nodes of `data` are at level **1**, not 0, so with the default increment a
top-level row is already indented by 10px.

That is deliberate. `NestedRow` indents by `level * paddingLeftIncrement`, so a 0
base would put top-level rows flush against the screen edge — changing the
appearance of every app built on the documented pattern, for no functional gain.
It is inherited from the synthetic root node the old recursive renderer wrapped
`data` in, and it is kept on purpose rather than by accident.

If you want a flush left edge, pass `level={level - 1}` or set your own
`paddingLeftIncrement`.

### Types

Two node types are exported, because a node on the way in and a node on the way
out are not the same shape.

| Type | What it describes |
| --- | --- |
| **`INode`** | a node as you write it in `data`. Every field is optional — add whatever your app needs |
| **`IRenderedNode`** | a node as `renderNode` and `onNodePressed` receive it: the `_internalId` the list assigned, and `opened` resolved to the node's current expanded state |
| **`IRow`** | one row of the flattened tree, as a custom `ListComponent` receives it in `renderItem` |
| **`IListProps`** | the shape of `listProps` |

```typescript
import NestedListView, {NestedRow, INode, IRenderedNode} from 'react-native-nested-listview'

const data: INode[] = [{title: 'Node 1', items: [{title: 'Node 1.1'}]}]

const renderNode = (node: IRenderedNode, level: number, isLastLevel: boolean) => (
  <NestedRow level={level}>
    <Text>{node.opened ? '▾' : '▸'} {node.title}</Text>
  </NestedRow>
)
```

`getChildrenName` and `keyExtractor` are handed an `INode`, not an
`IRenderedNode`: both are called while the tree is being walked, before the list
has assigned a node anything.

## Performance

The tree is flattened into a single array of visible rows, and one list renders
it. Depth is a number carried on a row rather than a level of nesting in the
component tree, so:

- there is one list, not one per node, whatever the shape of the data. Nesting
  lists of the same orientation is the arrangement React Native warns against,
  where windowing cannot work correctly
- the number of mounted rows is bounded by the window rather than by the size of
  the tree. A 20,000-level-deep tree mounts as few rows as a flat one
- expanding and collapsing recomputes the row array instead of mounting and
  unmounting lists. Rows that did not move keep their identity and are not
  re-rendered
- nothing walks the tree on an ordinary render. Only a change to `data` or
  `extraData` rebuilds the rows, so an inline `renderNode`, `onNodePressed` or
  `getChildrenName` costs nothing

`getChildrenName` and `keyExtractor` are read when the rows are built. If either
starts answering differently without `data` changing, change `extraData` to pick
it up.

### Using another list

Because the rows are already flat, any list with a `FlatList`-shaped API can
render them. Pass it as `ListComponent` to get that list's own recycling:

```javascript
import {LegendList} from '@legendapp/list'

<NestedListView
  data={data}
  renderNode={renderNode}
  ListComponent={LegendList}
/>
```

Each `item` is an `IRow`, so a custom list must pass its `item` through to
`renderItem` unchanged. What else the component sets, and what `listProps` can
and cannot override, is in [Reaching the list](#reaching-the-list).

### Node identity

Each node is given an `_internalId`: a path built from the node's own `id`, or
failing that its `key`, or failing that its position among its siblings.
`keyExtractor` overrides the choice. Identity is what expanded state is keyed by,
so giving nodes stable keys is what lets a node stay expanded while `data`
changes around it.

By default a node's expanded state is forgotten once the node leaves the tree,
including while it sits inside a collapsed parent. `keepOpenedState` keeps that
state instead, so a subtree comes back expanded as it was.

## Examples

There is a bare React Native project [here](https://github.com/fjmorant/react-native-nested-listview-examples)
and an Expo project [here](https://github.com/fjmorant/-react-native-nested-listview-examples-expo),
which covers custom nodes, state changes, extra data, dynamic content, children
as objects, a performance case and a Redux integration.

| Version App | React Native | Library |
| ----------- | ------------ | ------- |
| 1.0.1       | 0.86.3       | 0.15.0  |

## Roadmap

The roadmap is tracked on the [GitHub project board](https://github.com/users/fjmorant/projects/7),
alongside the issues in this repository.

## Development

```
yarn install      # Node 22, see .nvmrc
yarn check-all    # lint, type-check and tests
yarn build        # compile into dist/
```

Two extra checks guard what gets published, and both run in CI:

```
yarn check-build      # every emitted file parses as plain JavaScript
yarn check-package    # entrypoints and types agree, across all resolution modes
```

### Releasing

Publishing is driven by a GitHub release. Create one whose tag matches the
version in `package.json` — `v1.0.0` for `1.0.0`, with or without the `v` — and
the `Publish` workflow builds, re-runs every check, and publishes to npm with
[provenance](https://docs.npmjs.com/generating-provenance-statements).

```
# 1. bump the version and move the CHANGELOG heading, on a branch
# 2. merge it
# 3. create the release on the tag
gh release create v1.0.0 --title 1.0.0 --notes-from-tag
```

The workflow refuses to publish when the tag and `package.json` disagree, which
is the mistake that otherwise ships a version under the wrong release. Running
`Publish` manually from the Actions tab rehearses the whole thing and always
passes `--dry-run`, so it can never publish; provenance is left to real
releases, since a dry run has nothing to attest.

Publishing needs an `NPM_TOKEN` repository secret — an npm **automation** token,
since a classic token fails against an account that requires 2FA for publishing.

### Trying a local build in an app

Pack the library and install the tarball into the consuming app:

```
yarn build
npm pack
cd ../my-app
npm install ../react-native-nested-listview/react-native-nested-listview-<version>.tgz --install-links
```

`--install-links` matters. Without it, npm may symlink the package to this
repository instead of copying it, which pulls this repository's own
`node_modules` into resolution — including the React kept here as a
devDependency. Two copies of React means hooks resolve against a null
dispatcher, and the app fails at runtime with
`Cannot read property 'useCallback' of null`. The same applies to `npm link`
and `yarn link`.

## Invite me a coffee

If you want to invite me for a coffee after enjoying this library or just for fun.

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/D1D16TF2V)

Thanks
