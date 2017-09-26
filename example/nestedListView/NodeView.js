/* @flow */

import React from 'react'
import {
  TouchableWithoutFeedback,
  View,
  FlatList,
  type Props,
  type State,
} from 'react-native'

export default class NodeView extends React.PureComponent<Props, State> {
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

  state: {
    childrenNodes: Array<any>,
  }

  state = {
    childrenNodes: [],
  }

  componentWillMount = () => {
    const rootChildren = this.props.getChildren(this.props.node)

    if (rootChildren) {
      this.setState({
        childrenNodes: rootChildren.map((child, index) => {
          return this.props.generateIds(rootChildren[index])
        }),
      })
    }
  }

  onNodePressed = (node: any) => {
    if (this.state.childrenNodes) {
      const childrenNodes = this.state.childrenNodes.map((child, index) => {
        return this.props.searchTree(this.state.childrenNodes[index], node)
      })

      this.setState({childrenNodes})
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
        {node.opened && this.state.childrenNodes ? (
          <FlatList
            data={this.state.childrenNodes}
            renderItem={({item}) => renderChildrenNode(item)}
            keyExtractor={item => item.id}
          />
        ) : null}
      </View>
    )
  }
}
