/* @flow */

import React from 'react'
import {FlatList, type Props, type State} from 'react-native'
import NodeView from './NodeView'
import shortid from 'shortid'

export default class NestedListView extends React.PureComponent<Props, State> {
  props: {
    data: any,
    renderNode: Function,
    onNodePressed: Function,
    getChildrenName: Function,
    style: any,
  }

  state: {
    childrenNodes: Array<any>,
  }

  state = {
    childrenNodes: [],
  }

  componentWillMount = () => {
    const rootChildren = this.props.data
    if (rootChildren) {
      this.setState({
        childrenNodes: rootChildren.map((child, index) =>
          this.generateIds(rootChildren[index])
        ),
      })
    }
  }

  searchTree = (element: any, otherElement: any) => {
    if (element.id === otherElement.id) {
      element.opened = !element.opened

      return element
    }

    const childrenName = this.props.getChildrenName(element)

    if (childrenName) {
      const children = element[childrenName]

      if (children) {
        element[childrenName] = children.map((child, index) =>
          this.searchTree(children[index], otherElement)
        )
      }

      return element
    }

    return element
  }

  generateIds = (element: any) => {
    if (!element) {
      return
    }

    const childrenName = this.props.getChildrenName(element)

    if (childrenName) {
      const children = element[childrenName]

      if (children) {
        element[childrenName] = children.map((child, index) =>
          this.generateIds(children[index])
        )
      }
    }

    element.id = shortid.generate()

    return element
  }

  onNodePressed = (node: any) => {
    const childrenNodes = this.state.childrenNodes.map((child, index) =>
      this.searchTree(this.state.childrenNodes[index], node)
    )

    this.setState({childrenNodes})
    this.props.onNodePressed(node)
  }

  onCreateChildren = (item: any, level: number) => {
    return (
      <NodeView
        getChildren={(node: Object) => node[this.props.getChildrenName(node)]}
        key={item.id}
        node={item}
        searchTree={this.searchTree}
        generateIds={this.generateIds}
        onNodePressed={() => this.onNodePressed(item)}
        renderChildrenNode={(childrenNode: Object) =>
          this.onCreateChildren(childrenNode, level + 1)}
        renderNode={() => this.props.renderNode(item, level)}
      />
    )
  }

  render = () => {
    return (
      <FlatList
        data={this.state.childrenNodes}
        style={this.props.style}
        renderItem={({item}) => this.onCreateChildren(item, 0)}
        keyExtractor={item => item.id}
      />
    )
  }
}
