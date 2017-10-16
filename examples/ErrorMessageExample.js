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
import NestedListView, {type Node} from 'react-native-nested-listview'

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

  renderNode = (node: Node, level: number) => {
    const paddingLeft = (level + 1) * 30

    return (
      <View
        style={[
          styles.node,
          {paddingLeft, backgroundColor: node.opened ? 'yellow' : 'white'},
        ]}
      >
        <Text>{node.name}</Text>
      </View>
    )
  }

  onNodePressed = (node: Node) => {}

  getChildrenName = (node: Node) => {
    if (node.name === 'Item level 1.2.2') {
      return 'children'
    }

    return 'descendants'
  }

  render = () => {
    return (
      <View style={styles.container}>
        <NestedListView
          getChildrenName={this.getChildrenName}
          onNodePressed={this.onNodePressed}
          renderNode={this.renderNode}
        />
      </View>
    )
  }
}
