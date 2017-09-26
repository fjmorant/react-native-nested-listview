/* @flow */

import React from 'react'
import {TouchableWithoutFeedback, View, FlatList} from 'react-native'

export default class NodeView extends React.PureComponent {
  props: {
    generateIds: Function,
    getChildren: Function,
    node: any,
    searchTree: Function,
    onNodePressed: Function,
    onLayout: Function,
    renderNode: Function,
    renderChildrenNode: Function,
  }

  componentWillMount = () => {
    let rootChildren = this.props.getChildren(this.props.node)

    if (rootChildren) {
      rootChildren = rootChildren.map((child, index) => {
        return this.props.generateIds(rootChildren[index])
      })
    }

    this.setState({data: rootChildren})
  }

  onNodePressed = (node: any) => {
    if (this.state.data) {
      const newRootChildren = this.state.data.map((child, index) => {
        return this.props.searchTree(this.state.data[index], node)
      })

      this.setState({data: newRootChildren})
    }

    this.props.onNodePressed(node)
  }

  render() {
    const {node, onLayout, renderNode, renderChildrenNode} = this.props

    return (
      <View onLayout={onLayout}>
        <TouchableWithoutFeedback onPress={() => this.onNodePressed(node)}>
          {renderNode()}
        </TouchableWithoutFeedback>
        {node.opened && this.state.data ? (
          <FlatList
            data={this.state.data}
            renderItem={({item}) => renderChildrenNode(item)}
            keyExtractor={item => item.id}
          />
        ) : null}
      </View>
    )
  }
}
