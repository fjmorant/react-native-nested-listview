/* @flow */

import * as React from 'react'
import {FlatList, TouchableWithoutFeedback, View} from 'react-native'

export interface INode {
  id: string
  hidden: boolean
  opened: boolean
  [key: string]: any
}

export interface IProps {
  generateIds?: (node?: INode) => any
  getChildren?: () => any
  getChildrenName: (item: INode) => any
  node: INode
  level: number
  onNodePressed?: (item: any) => any
  renderNode: (item: any, level: number) => any
  renderChildrenNode?: (item: any) => any
}

export interface IState {
  node: INode
}

export default class NodeView extends React.PureComponent<IProps, IState> {
  public componentWillMount() {
    this.setState({
      node: {
        opened: false,
        ...this.props.node,
      },
    })
  }

  public onNodePressed = () => {
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

  public renderChildren = (item: INode, level: number): any => {
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

  public renderItem = ({item}: {item: INode}) =>
    this.renderChildren(item, this.props.level)

  public render() {
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
            keyExtractor={(item: INode) => item.id}
          />
        ) : null}
      </View>
    )
  }
}
