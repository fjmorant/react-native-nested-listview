/* @flow */

import isEqual from 'lodash.isequal'
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
})

export interface IProps {
  data: any
  extraData?: any
  renderNode: (elem: any, level?: number) => any
  onNodePressed?: () => any
  getChildrenName: (elem: any) => any
  style?: any
}

export interface IState {
  root: any
}

export default class NestedListView extends React.PureComponent<
  IProps,
  IState
> {
  public componentWillMount() {
    this.setState({root: this.generateRootNode(this.props)})
  }

  public componentWillReceiveProps(nextProps: any) {
    if (!isEqual(this.props.data, nextProps.data)) {
      this.setState({root: this.generateRootNode(nextProps)})
    }
  }

  public generateIds = (node?: INode) => {
    if (!node) {
      return
    }

    const childrenName: string = this.props.getChildrenName(node) || 'items'
    let children = node[childrenName]

    if (children) {
      if (!Array.isArray(children)) {
        children = Object.keys(children).map((key: string) => children[key])
      }
      node[childrenName] = children.map((_: INode, index: number) =>
        this.generateIds(children[index])
      )
    }

    node._internalId = shortid.generate()

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
        extraData={this.props.extraData}
      />
    )
  }

  private generateRootNode = (props: any): INode => {
    return {
      _internalId: shortid.generate(),
      items: props.data
        ? props.data.map((_: INode, index: number) =>
            this.generateIds(props.data[index])
          )
        : [],
      name: 'root',
      opened: true,
      hidden: true,
    }
  }
}
