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
import NestedListView from 'react-native-nested-listview'

const data = [
  {
    name: 'Main Parent',
    children: {
      child1: {
        name: 'Main Child 1',
        children: {
          child1: {
            name: 'Sub Child 1',
            children: {},
          },
          child2: {
            name: 'Sub Child 2',
            children: {
              subChild: {
                name: 'Sample',
                children: {},
              },
            },
          },
        },
      },
      child2: {
        name: 'Main Child 2',
        children: {
          child1: {
            name: 'Sub Child 1',
            children: {},
          },
          child2: {
            name: 'Sub Child 2',
            children: {},
          },
        },
      },
    },
  },
]

const colorLevels = {
  [0]: 'white',
  [1]: 'blue',
  [2]: 'green',
  [3]: 'red',
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'rgb(255, 255, 255)', padding: 15},
  node: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgb(0, 0, 0)',
  },
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
    alert(node.name)
  }

  getChildrenName = (node: Object) => {
    return 'children'
  }

  render = () => {
    return (
      <View style={styles.container}>
        <NestedListView
          data={data}
          getChildrenName={this.getChildrenName}
          onNodePressed={this.onNodePressed}
          renderNode={this.renderNode}
        />
      </View>
    )
  }
}
