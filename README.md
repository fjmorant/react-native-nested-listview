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

`listProps` is forwarded to the underlying list:

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

Props reach the list in this order:

| Order | What | |
| --- | --- | --- |
| 1 | `listProps` | |
| 2 | `extraData`, `initialNumToRender`, `style` | win over `listProps`, and only when you pass them |
| 3 | `data`, `renderItem`, `keyExtractor` | set by the component. Excluded from `IListProps`, so passing one is a compile error |

`initialNumToRender` has two spellings: its own prop and
`listProps.initialNumToRender`. They are equivalent, and the prop wins if you set
both.

`IListProps` is typed against `FlatList`. Another `ListComponent` with props of
its own may need a cast.

### NestedRow

| Prop                       | Description                                                                     | Type                   | Default                                   |
| -------------------------- | ------------------------------------------------------------------------------- | ---------------------- | ----------------------------------------- |
| **`children`**             | Content of the row                                                              | `ReactNode`            | Not required                              |
| **`level`**                | Nesting depth, used to indent the row. Pass the `level` given to `renderNode`    | number                 | `0`                                       |
| **`paddingLeftIncrement`** | Left padding added per level, in pixels                                         | number                 | `10`                                      |
| **`height`**               | Fixed height for the row                                                        | number                 | Not required — the row sizes to its content |
| **`style`**                | Row container style                                                             | `StyleProp<ViewStyle>` | Not required                              |

#### Levels start at 1

The nodes of `data` are at level 1, so with the default increment a top-level row
is indented by 10px. For a flush left edge pass `level={level - 1}`, or set your
own `paddingLeftIncrement`.

### Types

| Type | What it describes |
| --- | --- |
| **`INode`** | a node as you write it in `data`. Every field is optional |
| **`IRenderedNode`** | what `renderNode` and `onNodePressed` receive, where `_internalId` is a `string` and `opened` a `boolean` |
| **`IRow`** | one row of the flattened tree, as a custom `ListComponent` receives it |
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

`getChildrenName` and `keyExtractor` receive an `INode`.

## Performance

The tree is flattened into a single array of visible rows, rendered by one list.
Depth is a number on a row rather than a level of nesting in the component tree.

- one list, whatever the shape of the data
- the number of mounted rows is bounded by the window, not by the size of the
  tree. A 20,000-level-deep tree mounts as few rows as a flat one
- expanding and collapsing recomputes the row array. Rows that did not move keep
  their identity and are not re-rendered
- only a change to `data` or `extraData` rebuilds the rows, so inline
  `renderNode` and `onNodePressed` callbacks cost nothing

`getChildrenName` and `keyExtractor` are read when the rows are built. Change
`extraData` if either starts returning something different while `data` stays
the same.

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

Each `item` is an `IRow`; pass it through to `renderItem` unchanged. See
[Reaching the list](#reaching-the-list) for what `listProps` can override.

### Node identity

Each node gets an `_internalId`: a path built from its own `id`, or its `key`, or
its position among its siblings. `keyExtractor` overrides that.

Expanded state is keyed by this id, so stable keys keep a node expanded while
`data` changes around it. The state is dropped once a node leaves the tree,
including while it sits inside a collapsed parent. `keepOpenedState` keeps it.

## Examples

Runnable examples live in the
[Expo examples app](https://github.com/fjmorant/-react-native-nested-listview-examples-expo),
covering custom nodes, state changes, extra data, dynamic content, children as
objects, a performance case, `listProps` and a Redux integration.

| Example app | Expo SDK | React Native | Library |
| ----------- | -------- | ------------ | ------- |
| 1.1.0       | 57       | 0.86.3       | 1.0.0   |

```
git clone https://github.com/fjmorant/-react-native-nested-listview-examples-expo
cd -react-native-nested-listview-examples-expo
npm install && npm start
```

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

**Actions → Publish → Run workflow.**

It takes the version from `package.json` and the release notes from that
version's CHANGELOG entry, runs the checks, publishes to npm with
[provenance](https://docs.npmjs.com/generating-provenance-statements), and
creates the GitHub release.

**Rehearse only** is ticked by default: it runs every check and publishes
nothing. Untick it to release.

The run stops before publishing if the version is already tagged, already on
npm, or has no `## <version>` section in the CHANGELOG.

```
# 1. a PR bumping package.json and adding the CHANGELOG entry
# 2. merge it
# 3. Actions -> Publish -> Run workflow, with Rehearse only unticked
```

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
