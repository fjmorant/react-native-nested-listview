/* @flow */

import React from 'react'
import {FlatList, type Props, type State, Text, View} from 'react-native'
import NodeView, {type Node} from './NodeView'
import shortid from 'shortid'
export type {Node}

export default class NestedListView extends React.PureComponent<Props, State> {
  props: {
    data: any,
    renderNode: Function,
    onNodePressed: Function,
    getChildrenName: Function,
    style: any,
  }

  componentWillMount = () => {
    const root: Node = {
      id: shortid.generate(),
      items: this.props.data
        ? this.props.data.map((child: Node, index: number) =>
            this.generateIds(this.props.data[index])
          )
        : [],
      name: 'root',
      opened: true,
      hidden: true,
    }

    this.setState({root})
  }

  generateIds = (node: Node) => {
    if (!node) {
      return
    }

    const childrenName: string = this.props.getChildrenName(node) || 'items'
    const children = node[childrenName]

    if (children) {
      node[childrenName] = children.map((child, index) =>
        this.generateIds(children[index])
      )
    }

    node.id = shortid.generate()

    return node
  }

  getChildrenName = (node: Node) => {
    if (node.name === 'root') {
      return 'items'
    }

    return this.props.getChildrenName
      ? this.props.getChildrenName(node)
      : 'items'
  }

  render = () => {
    const {
      data,
      getChildrenName,
      onNodePressed,
      renderNode,
      style
    } = this.props
    
    if (!getChildrenName) {
      return <Text>getChildrenName has been passed</Text>
    }

    if (!renderNode) {
      return <Text>renderNode has been passed</Text>
    }

    if (!data) {
      return <Text>No data has been passed</Text>
    }

    return (
      <View style={style}>
        <NodeView
          getChildrenName={this.getChildrenName}
          node={this.state.root}
          onNodePressed={onNodePressed}
          generateIds={this.generateIds}
          level={0}
          renderNode={renderNode}
        />
      </View>
    )
  }
}
