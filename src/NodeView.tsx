import React, { useEffect, useState } from 'react';
import isEqual from 'react-fast-compare';
import { FlatList, TouchableWithoutFeedback, View } from 'react-native';
import globalHook from 'use-global-hook';

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
  keepOpenedState?: boolean;
}

export interface IState {
  node: INode;
  extraData?: any;
  opened: boolean;
}

const actions = {
  setOpenedNode: (store: any, { internalId, opened }: any) => {
    store.setState({
      nodesState: { ...store.state.nodesState, [internalId]: opened },
    });
  },
};

const useGlobal = globalHook(
  React,
  {
    nodesState: { root: true },
  },
  actions,
);

const NodeView = React.memo(
  ({
    renderNode,
    extraData,
    level,
    getChildrenName,
    node,
    onNodePressed,
    keepOpenedState,
  }: IProps) => {
    const [globalState, globalActions]: [any, any] = useGlobal();

    // tslint:disable-next-line:variable-name
    const [_node, setNode]: [INode, any] = useState({
      ...node,
      opened:
        keepOpenedState && globalState.nodesState[node._internalId]
          ? globalState.nodesState[node._internalId]
          : node.opened,
    });

    useEffect(() => {
      setNode({
        ...node,
        opened: _node.opened,
      });
    }, [node, _node.opened]);

    // tslint:disable-next-line:variable-name
    const _onNodePressed = () => {
      if (keepOpenedState) {
        globalActions.setOpenedNode({
          internalId: _node._internalId,
          opened: !_node.opened,
        });
      }

      setNode({
        ..._node,
        opened: !_node.opened,
      });

      if (onNodePressed) {
        onNodePressed(_node);
      }
    };

    // tslint:disable-next-line:variable-name
    const renderChildren = (item: INode, _level: number): any => {
      return (
        <NodeView
          getChildrenName={getChildrenName}
          node={item}
          level={_level + 1}
          extraData={extraData}
          onNodePressed={onNodePressed}
          renderNode={renderNode}
          keepOpenedState={keepOpenedState}
        />
      );
    };

    const renderItem = ({ item }: { item: INode }) =>
      renderChildren(item, level);

    const rootChildrenName = getChildrenName(_node);
    const rootChildren = _node[rootChildrenName];

    const isNodeOpened =
      (keepOpenedState && globalState.nodesState[node._internalId]) ||
      _node.opened;

    return (
      <>
        {!_node.hidden ? (
          <TouchableWithoutFeedback onPress={_onNodePressed}>
            <View>{renderNode(_node, level)}</View>
          </TouchableWithoutFeedback>
        ) : null}
        {isNodeOpened && rootChildren ? (
          <FlatList
            data={rootChildren}
            renderItem={renderItem}
            extraData={extraData}
            keyExtractor={(item: INode) => item._internalId}
          />
        ) : null}
      </>
    );
  },
  isEqual,
);

export { NodeView };
