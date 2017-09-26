/* @flow */

import React from 'react'
import {TouchableWithoutFeedback, View, FlatList} from 'react-native'

export default class NodeView extends React.PureComponent {
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
      const newState = (rootChildren = this.state.data.map((child, index) => {
        return this.props.searchTree(this.state.data[index], node)
      }))

      this.setState({data: newState})
    }

    this.props.onNodePressed(node)
  }

  render() {
    const {
      getChildren,
      node,
      nodeStyle,
      onLayout,
      onNodePressed,
      renderNode,
      renderChildrenNode,
    } = this.props
    const children = getChildren(node)

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
