/* @flow */

import React, { useState, useEffect } from "react";
import isEqual from "react-fast-compare";
import { FlatList, TouchableWithoutFeedback, View } from "react-native";

export interface INode {
  _internalId: string;
  hidden: boolean;
  opened: boolean;
  [key: string]: any;
}

export interface IProps {
  generateIds?: (node?: INode) => any;
  getChildren?: () => any;
  getChildrenName: (item: INode) => any;
  node: INode;
  level: number;
  onNodePressed?: (item: any) => any;
  renderNode: (item: any, level: number) => any;
  renderChildrenNode?: (item: any) => any;
  extraData?: any;
}

export interface IState {
  node: INode;
  extraData?: any;
  opened: boolean;
}

const NodeView = ({
  renderNode,
  extraData,
  level,
  getChildrenName,
  node,
  onNodePressed
}: IProps) => {
  const [_node, setNode]: [INode, any] = useState({
    opened: false,
    ...node
  });

  useEffect(() => {
    setNode({
      ...node,
      opened: false
    });
  });

  const _onNodePressed = () => {
    setNode({
      ..._node,
      opened: !_node.opened
    });

    if (onNodePressed) {
      onNodePressed(_node);
    }
  };

  const renderChildren = (item: INode, _level: number): any => {
    return (
      <NodeView
        getChildrenName={getChildrenName}
        node={item}
        level={_level + 1}
        extraData={extraData}
        onNodePressed={onNodePressed}
        renderNode={renderNode}
      />
    );
  };

  const renderItem = ({ item }: { item: INode }) => renderChildren(item, level);

  const rootChildrenName = getChildrenName(_node);
  const rootChildren = _node[rootChildrenName];

  return (
    <View>
      {!_node.hidden ? (
        <TouchableWithoutFeedback onPress={_onNodePressed}>
          <View>{renderNode(_node, level)}</View>
        </TouchableWithoutFeedback>
      ) : null}
      {_node.opened && rootChildren ? (
        <FlatList
          data={rootChildren}
          renderItem={renderItem}
          extraData={extraData}
          keyExtractor={(item: INode) => item._internalId}
        />
      ) : null}
    </View>
  );
};

export default NodeView;
