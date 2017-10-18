# react-native-nested-listview

[![Greenkeeper badge](https://badges.greenkeeper.io/fjmorant/react-native-nested-listview.svg)](https://greenkeeper.io/)
UI component for React Native that allows to create a listview with N levels of nesting

![platforms](https://img.shields.io/badge/platforms-Android%20%7C%20iOS-brightgreen.svg?style=flat-square)
[![CircleCI](https://circleci.com/gh/fjmorant/react-native-nested-listview.svg?style=svg)](https://circleci.com/gh/fjmorant/react-native-nested-listview)
[![dependencies Status](https://david-dm.org/boennemann/badges/status.svg)](https://david-dm.org/boennemann/badges)
[![npm](https://img.shields.io/npm/v/react-native-nested-listview.svg?style=flat-square)](https://www.npmjs.com/package/react-native-nested-listview)
[![github release](https://img.shields.io/github/release/fjmorant/react-native-nested-listview.svg?style=flat-square)](https://github.com/fjmorant/react-native-nested-listview/releases)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)   

![react-native-nested-listview](https://imgur.com/OqvopyK.gif)


## Table of contents

1. [Usage](#usage)
1. [Props](#props)
1. [Example](#example)
1. [Roadmap](#roadmap)


## Usage

```
yarn add react-native-nested-listview
```

```javascript
import NestedListview from 'react-native-nested-listview'

const data = [{title: 'Node 1', items: [{title: 'Node 1.1'}, {title: 'Node 1.2'}]}]

<NestedListView
  data={data}
  getChildrenName={(node) => 'items'}
  onNodePressed={(node) => alert('Selected node')}
  renderNode={(node, level) => (
    <View style={styles.row}>
      <Text>{node.title}</Text>
    </View>
  )}
/>
```

## Props

### Required

Prop | Description | Type | Default
------ | ------ | ------ | ------
**`data`** | Array of nested items | Array | **Required**
**`renderNode`** | Takes a node from data and renders it into the NestedlistView. The function receives `{node, level}` (see [Usage](#usage)) and must return a React element. | Function | **Required**
**`getChildrenName`** | Function to determine in a node where are the children, by default NestedListView will try to find them in **items** | Function | **items**
**`onNodePressed`** | Function called when a node is pressed by a user | Function | Not required

## Example
You can find the following example in the [`/example` folder](https://github.com/fjmorant/react-native-nested-listview/tree/master/example).

## Roadmap

 - Autoscrolling optionally
 - Expand/contract nodes programatically
 - Support animations
 - Add more examples of usage
