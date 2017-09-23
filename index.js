/* @flow */

import React from 'react'
import {ScrollView} from 'react-native'
import NodeView from './NodeView'
import shortid from 'shortid'

export default class NestedListView extends React.Component {
  props: {
    data: any,
    renderNode: Function,
    onNodePressed: Function,
    getChildrenName: Function,
    autoScrollToNodeId: ?string,
  }

  scrollview: any

  state = {
    data: {},
  }

  componentWillMount = () => {
    let rootChildren = this.props.data
    if (rootChildren) {   
      for (i = 0; i < rootChildren.length; i++) {
        rootChildren[i] = this.generateIds(rootChildren[i])
      }
    } 

    this.setState({data: rootChildren})
  }

  contractAllNodesInTree = () => {
    this.setState({data: this.compactNodeInTree(this.state.data)})
  }

  expandNode = (node: any) => {
    this.setState({data: this.expandNodeInTree(this.state.data, node)})
  }

  compactNodeInTree = (element: any) => {
    const childrenName = this.props.getChildrenName(element)

    if (childrenName && element.opened) {
      const children = element[childrenName]

      if (children) {           
        for (i = 0; i < children.length; i++) {
          element[childrenName][i] = this.compactNodeInTree(children[i])
        }
      }

      element.opened = false

      return element
    }

    element.opened = false

    return element
  }

  expandNodeInTree = (element: any, otherElement: any) => {
    const childrenName = this.props.getChildrenName(element)

    if (otherElement && element.id == otherElement.id) {
      element.opened = true

      return element
    } else if (childrenName) {
      const children = element[childrenName]

      if (children) {
        var anyChildrenHasOpened = false        
        for (i = 0; i < children.length; i++) {
          element[childrenName][i] = this.expandNodeInTree(
            children[i],
            otherElement,
          )
  
          if (element[childrenName][i].opened) {
            anyChildrenHasOpened = true
          }
        }
  
        if (anyChildrenHasOpened) {
          element.opened = true
        }
      }

      return element
    }

    return element
  }

  searchTree = (element: any, otherElement: any) => {
    const childrenName = this.props.getChildrenName(element)

    if (element.id == otherElement.id) {
      element.opened = !element.opened

      return element
    } 
    
    if (childrenName) {
      const children = element[childrenName]

      if (children) {          
        for (i = 0; i < children.length; i++) {
          element[childrenName][i] = this.searchTree(children[i], otherElement)
        }
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
          for (i = 0; i < children.length; i++) {
            element[childrenName][i] = this.generateIds(children[i])
          }
      } 
    }

    element.id = shortid.generate()

    return element
  }

  onNodePressed = (node: any) => {
    const newState = this.state.data
    for (i = 0; i < newState.length; i++) {
      newState[i] = this.searchTree(newState[i], node)
    }

    this.setState({data: newState})
    this.props.onNodePressed(node)
  }

  onLayoutSelectedNode = (event: any) => {
    const {x, y} = event.nativeEvent.layout

    this.scrollview.scrollTo({x, y, animated: true})
  }

  onCreateChildren = (item: any, level: number) => {
    const autoScrollToNodeId = this.props.autoScrollToNodeId

    return (
      <NodeView
        getChildren={(node: Object) => node[this.props.getChildrenName(node)]}
        key={item.id}
        node={item}
        onLayout={
          autoScrollToNodeId && item.id_video === autoScrollToNodeId
            ? this.onLayoutSelectedNode
            : null
        }
        onNodePressed={() => this.onNodePressed(item)}
        renderChildrenNode={(childrenNode: Object) =>
          this.onCreateChildren(childrenNode, level + 1)}
        renderNode={() => this.props.renderNode(item, level)}
      />
    )
  }

  render = () => {
    
    return (
      <ScrollView
        ref={ref => {this.scrollview = ref}}
        style={...this.props.style}>
        {this.state.data
          ? this.state.data.map((item: Object) => this.onCreateChildren(item, 0))
          : null}
      </ScrollView>
    )
  }
}
