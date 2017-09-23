/* @flow */

import React from 'react'
import {TouchableOpacity, View} from 'react-native'

const NodeView = ({
  getChildren,
  node,
  renderNode,
  renderChildrenNode,
  onLayout,
  onNodePressed,
}: {
  getChildren: Function,
  node: any,
  nodeStyle?: any,
  onLayout?: Function,
  onNodePressed: Function,
  renderNode: Function,
  renderChildrenNode: Function,
}) => {
  const children = getChildren(node)

  return (
    <View onLayout={onLayout}>
      <TouchableOpacity onPress={() => onNodePressed(node)}>
        {renderNode()}
      </TouchableOpacity>
      {node.opened && children
        ? <View>
            {children.map(renderChildrenNode)}
          </View>
        : null}
    </View>
  )
}

export default NodeView
