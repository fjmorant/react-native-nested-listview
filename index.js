/* @flow */

import React from 'react'
import {FlatList, type Props, type State, Text, View} from 'react-native'
import NodeView, {type Node} from './NodeView'
import shortid from 'shortid'

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

    const childrenName: string = this.props.getChildrenName(node)

    if (childrenName) {
      const children = node[childrenName]

      if (children) {
        node[childrenName] = children.map((child, index) =>
          this.generateIds(children[index])
        )
      }
    }

    node.id = shortid.generate()

    return node
  }

  getChildrenName = (node: Node) => {
    if (node.name === 'root') {
      return 'items'
    }

    return this.props.getChildrenName(node)
  }

  render = () => {
    if (!this.props.getChildrenName) {
      return <Text>getChildrenName has been passed</Text>
    }

    if (!this.props.renderNode) {
      return <Text>renderNode has been passed</Text>
    }

    if (!this.props.data) {
      return <Text>No data has been passed</Text>
    }

    return (
      <View style={this.props.style}>
        <NodeView
          getChildrenName={this.getChildrenName}
          node={this.state.root}
          onNodePressed={this.props.onNodePressed}
          generateIds={this.generateIds}
          level={0}
          renderNode={this.props.renderNode}
        />
      </View>
    )
  }
}
