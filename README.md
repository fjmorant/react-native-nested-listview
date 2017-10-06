# react-native-nested-listview
Nested listview component for React native that it allows to create a listview that has N levels of nesting


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
  renderNode={(node, level) => <Text>{node.name}</Text>}
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

![react-native-nested-listview](https://imgur.com/OqvopyK.gif)

## Roadmap

 - Autoscrolling optionally
 - Expand/contract nodes programatically
 - Support animations
 - Add more examples of usage
