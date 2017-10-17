/* @flow */

import React from 'react'
import {
  FlatList,
  type Props,
  type State,
  Text,
  View,
  StyleSheet,
} from 'react-native'
import NodeView, {type Node} from './NodeView'
import shortid from 'shortid'
export type {Node}

const styles = StyleSheet.create({
  errorContainer: {
    borderColor: 'rgb(84, 85, 86)',
    backgroundColor: 'rgb(237, 57, 40)',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  errorText: {
    color: 'rgb(255, 255, 255)',
    fontSize: 17,
    fontWeight: 'bold',
  },
})
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

  renderErrorMessage(prop: string) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>prop {prop} has not been passed</Text>
      </View>
    )
  }

  render = () => {
    const {data, getChildrenName, onNodePressed, renderNode, style} = this.props

    if (!getChildrenName) {
      return this.renderErrorMessage('getChildrenName')
    }

    if (!renderNode) {
      return this.renderErrorMessage('renderNode')
    }

    if (!data) {
      return this.renderErrorMessage('data')
    }

    return (
      <NodeView
        getChildrenName={this.getChildrenName}
        node={this.state.root}
        onNodePressed={onNodePressed}
        generateIds={this.generateIds}
        level={0}
        renderNode={renderNode}
      />
    )
  }
}
