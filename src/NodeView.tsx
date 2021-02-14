import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import isEqual from 'react-fast-compare';
import { FlatList, Pressable } from 'react-native';
import globalHook from 'use-global-hook';

export interface INode {
  _internalId: string;
  hidden: boolean;
  opened: boolean;
  [key: string]: any;
}

export interface IProps {
  getChildrenName: (item: INode) => string;
  node: INode;
  level: number;
  onNodePressed?: (item: INode) => void;
  renderNode: (
    item: INode,
    level: number,
    isLastLevel: boolean,
  ) => ReactElement;
  renderChildrenNode?: (item: INode) => ReactElement;
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

    const [_node, setNode]: [INode, any] = useState({
      ...node,
      opened:
        keepOpenedState && globalState.nodesState[node._internalId]
          ? !!globalState.nodesState[node._internalId]
          : !!node.opened,
    });

    useEffect(() => {
      setNode({
        ...node,
        opened: _node.opened,
      });
    }, [node, _node.opened]);

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

    const renderChildren = useCallback(
      (item: INode, _level: number): ReactElement => (
        <NodeView
          getChildrenName={getChildrenName}
          node={item}
          level={_level + 1}
          extraData={extraData}
          onNodePressed={onNodePressed}
          renderNode={renderNode}
          keepOpenedState={keepOpenedState}
        />
      ),
      [extraData, getChildrenName, onNodePressed, renderNode, keepOpenedState],
    );

    const renderItem = useCallback(
      ({ item }: { item: INode }) => renderChildren(item, level),
      [renderChildren, level],
    );

    const nodeChildrenName = getChildrenName(_node);
    const nodeChildren: [] = _node[nodeChildrenName];

    const isNodeOpened =
      (keepOpenedState && globalState.nodesState[node._internalId]) ||
      _node.opened;

    return (
      <>
        {!_node.hidden ? (
          <Pressable onPress={_onNodePressed}>
            {renderNode(_node, level, !nodeChildren || !nodeChildren.length)}
          </Pressable>
        ) : null}
        {isNodeOpened && nodeChildren ? (
          <FlatList
            data={nodeChildren}
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
