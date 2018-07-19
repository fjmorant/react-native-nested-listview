/* @flow */

import isEqual from 'lodash.isequal'
import * as React from 'react'
import {FlatList, TouchableWithoutFeedback, View} from 'react-native'

export interface INode {
  _internalId: string
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
  extraData?: any
}

export interface IState {
  node: INode
  extraData?: any
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

  public componentWillReceiveProps(nextProps: IProps) {
    if (!isEqual(this.props.node, nextProps.node)) {
      this.setState({
        node: {
          opened: false,
          ...nextProps.node,
        },
      })
    }
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
        extraData={this.props.extraData}
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
            extraData={this.props.extraData}
            keyExtractor={(item: INode) => item._internalId}
          />
        ) : null}
      </View>
    )
  }
}
