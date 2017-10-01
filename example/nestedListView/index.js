/* @flow */

import React from 'react'
import {FlatList, type Props, type State, View} from 'react-native'
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

  componentWillMount = () => {
    const root = {
      id: 1,
      items: this.props.data.map((child, index) =>
        this.generateIds(this.props.data[index])
      ),
      name: 'root',
      opened: true,
      hidden: true,
    }

    this.setState({root})
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

  getChildrenName = node => {
    if (node.name === 'root') {
      return 'items'
    }

    return this.props.getChildrenName(node)
  }

  render = () => {
    return (
      <View style={this.props.style}>
        <NodeView
          getChildrenName={this.getChildrenName}
          node={this.state.root}
          generateIds={this.generateIds}
          level={0}
          renderNode={(item, level) => this.props.renderNode(item, level)}
        />
      </View>
    )
  }
}
