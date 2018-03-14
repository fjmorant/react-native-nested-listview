/* @flow */

import * as React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import * as shortid from 'shortid'
import NodeView, {INode} from './NodeView'

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
  nestedRow: {
    flex: 1,
    justifyContent: 'center',
  },
})

export interface IProps {
  height?: number
  children: any
  level?: number
  style?: any
}

export class NestedRow extends React.PureComponent<IProps> {
  public render() {
    const {height = 50, children, level = 0, style} = this.props

    return (
      <View
        style={[
          styles.nestedRow,
          {
            ...style,
            height,
            paddingLeft: level * 10,
          },
        ]}>
        {children}
      </View>
    )
  }
}

// tslint:disable-next-line:max-classes-per-file
export default class NestedListView extends React.PureComponent<
  {
    data: any
    renderNode: (elem: any, level?: number) => any
    onNodePressed?: () => any
    getChildrenName: (elem: any) => any
    style?: any
  },
  {root: any}
> {
  public componentWillMount() {
    const root: INode = {
      id: shortid.generate(),
      items: this.props.data
        ? this.props.data.map((_: INode, index: number) =>
            this.generateIds(this.props.data[index])
          )
        : [],
      name: 'root',
      opened: true,
      hidden: true,
    }

    this.setState({root})
  }

  public generateIds = (node?: INode) => {
    if (!node) {
      return
    }

    const childrenName: string = this.props.getChildrenName(node) || 'items'
    const children = node[childrenName]

    if (children) {
      node[childrenName] = children.map((_: INode, index: number) =>
        this.generateIds(children[index])
      )
    }

    node.id = shortid.generate()

    return node
  }

  public getChildrenName = (node: INode) => {
    if (node.name === 'root') {
      return 'items'
    }

    return this.props.getChildrenName
      ? this.props.getChildrenName(node)
      : 'items'
  }

  public renderErrorMessage(prop: string) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>prop {prop} has not been passed</Text>
      </View>
    )
  }

  public render() {
    const {data, getChildrenName, onNodePressed, renderNode} = this.props

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
