/* @flow */

import * as React from 'react'
import {TouchableWithoutFeedback, View, FlatList} from 'react-native'

export type Node = {
  id: string
  hidden: boolean
  opened: boolean
  [key: string]: any
}

export interface IProps {
  generateIds?: Function
  getChildren?: Function
  getChildrenName: Function
  node: Node
  level: number
  onNodePressed: Function
  renderNode: Function
  renderChildrenNode?: Function
}

export interface IState {
  node: Node
}

export default class NodeView extends React.PureComponent<IProps, IState> {
  componentWillMount() {
    this.setState({
      node: {
        opened: false,
        ...this.props.node,
      },
    })
  }

  onNodePressed = () => {
    this.setState({
      node: {
        ...this.state.node,
        opened: !this.state.node.opened,
      },
    })

    if (this.props.onNodePressed) {
      this.props.onNodePressed(this.state.node)
    }
  }

  renderChildren = (item: Node, level: number): any => {
    return (
      <NodeView
        getChildrenName={this.props.getChildrenName}
        node={item}
        level={level + 1}
        onNodePressed={this.props.onNodePressed}
        renderNode={this.props.renderNode}
      />
    )
  }

  renderItem = ({item}: {item: Node}) =>
    this.renderChildren(item, this.props.level)

  render() {
    const rootChildrenName = this.props.getChildrenName(this.state.node)
    const rootChildren = this.state.node[rootChildrenName]

    return (
      <View>
        {!this.state.node.hidden ? (
          <TouchableWithoutFeedback onPress={this.onNodePressed}>
            <View>
              {this.props.renderNode(this.state.node, this.props.level)}
            </View>
          </TouchableWithoutFeedback>
        ) : null}
        {this.state.node.opened && rootChildren ? (
          <FlatList
            data={rootChildren}
            renderItem={this.renderItem}
            keyExtractor={item => item.id}
          />
        ) : null}
      </View>
    )
  }
}
