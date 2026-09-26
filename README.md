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

This library is pure JavaScript. It contains no native modules, no `codegenConfig`
and no iOS or Android sources, and builds only on core components —
`VirtualizedList`, `Pressable`, `View`, `Text` and `StyleSheet` — so it behaves
the same under Fabric as under the legacy renderer. It also runs in Expo Go.

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
| **`data`**               | Array of nested items                                                                                                                                                    | Array    | **Required** |
| **`renderNode`**         | Takes a node from data and renders it into the NestedlistView. The function receives `{node, level, isLastLevel}` (see [Usage](#usage)) and must return a React element. | Function | **Required** |
| **`getChildrenName`**    | Function to determine in a node where are the children, by default NestedListView will try to find them in **items**                                                     | Function | **items**    |
| **`onNodePressed`**      | Function called when a node is pressed by a user                                                                                                                         | Function | Not required |
| **`extraData`**          | A marker property for telling the list to re-render                                                                                                                      | Boolean  | Not required |
| **`keepOpenedState`**    | Prop for keeping the opened state of each node when data passed to the list changes                                                                                      | Boolean  | Not required |
| **`initialNumToRender`** | Prop for setting the initial amount of items to render.                                                                                                                  | number   | Not required |

### NestedRow

| Prop           | Description                 | Type      | Default      |
| -------------- | --------------------------- | --------- | ------------ |
| **`height`**   | Height of the row           | number    | 50           |
| **`children`** | Content of the NestedRow    | Component | **Required** |
| **`level`**    | Level where a given node is | number    | **Required** |
| **`style`**    | NestedRow container style   | Style     | Not required |

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
