/* @flow */

import React from 'react'
import {
  Alert,
  StyleSheet,
  Text,
  View,
  type Props,
  type State,
} from 'react-native'
import NestedListView from './nestedListView'

const generateXNumItems = (numItems, prefix) => {
  const items = []

  let i

  for (i = 0; i < numItems; i++) {
    items.push({
      name: `${prefix}.${i}`,
    })
  }

  return items
}

const data = [
  {
    name: 'Item level 1.1',
    descendants: generateXNumItems(10, 'Item level 1.1'),
  },
  {
    name: 'Item level 1.2',
    descendants: [
      {
        name: 'Item level 1.2.1',
      },
      {
        name: 'Item level 1.2.2',
        children: generateXNumItems(25, 'Item level 1.2.2'),
      },
    ],
  },
  {
    name: 'Item level 1.3',
    descendants: generateXNumItems(50, 'Item level 1.3'),
  },
]

const colorLevels = {
  [0]: 'white',
  [1]: 'blue',
  [2]: 'green',
  [3]: 'red',
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'rgb(255, 255, 255)', padding: 10},
  node: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgb(0, 0, 0)',
  },
  nestedListView: {padding: 10, flex: 1},
})
export default class ExampleApp extends React.Component<Props, State> {
  nestedListView: any

  renderNode = (node: Object, level: number) => {
    const paddingLeft = (level + 1) * 30
    const backgroundColor = colorLevels[level] || 'white'

    return (
      <View style={[styles.node, {backgroundColor, paddingLeft}]}>
        <Text>{node.name}</Text>
      </View>
    )
  }

  onNodePressed = (node: any) => {
    // alert(node)
  }

  getChildrenName = (node: Object) => {
    if (node.name === 'Item level 1.2.2') {
      return 'children'
    }

    return 'descendants'
  }

  render = () => {
    return (
      <View style={styles.container}>
        <NestedListView
          data={data}
          getChildrenName={this.getChildrenName}
          onNodePressed={this.onNodePressed}
          ref={ref => {
            this.nestedListView = ref
          }}
          renderNode={this.renderNode}
          style={styles.nestedListView}
        />
      </View>
    )
  }
}
