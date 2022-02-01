import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable } from 'react-native';
import globalHook, { Store } from 'use-global-hook';
import { GlobalState, INode, NodeActions } from './types';

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

const actions = {
  setOpenedNode: (
    store: Store<GlobalState, NodeActions>,
    { internalId, opened }: any,
  ) => {
    store.setState({
      nodesState: { ...store.state.nodesState, [internalId]: opened },
    });
  },
};

const initialState: GlobalState = {
  nodesState: { root: true },
};

// @ts-ignore
const useGlobal = globalHook<GlobalState, NodeActions>(initialState, actions);

const NodeView: React.FC<IProps> = React.memo(
  ({
    renderNode,
    extraData,
    level,
    getChildrenName,
    node,
    onNodePressed,
    keepOpenedState,
  }) => {
    const [globalState, globalActions]: [any, any] = useGlobal();

    const [_node, setNode]: [INode, any] = useState({
      ...node,
      opened:
        keepOpenedState && globalState?.nodesState[node._internalId]
          ? !!globalState?.nodesState[node._internalId]
          : !!node.opened,
    });

    useEffect(() => {
      setNode({
        ...node,
        opened: _node.opened,
      });
    }, [node, _node.opened]);

    const _onNodePressed = useCallback(() => {
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
    }, [_node, globalActions, keepOpenedState, onNodePressed]);

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

    const keyExtractor = useCallback((item: INode) => item._internalId, []);

    const nodeChildrenName = getChildrenName(_node);
    const nodeChildren: [] = _node[nodeChildrenName];

    const isNodeOpened =
      (keepOpenedState && globalState?.nodesState[node._internalId]) ||
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
            keyExtractor={keyExtractor}
          />
        ) : null}
      </>
    );
  },
);

NodeView.displayName = 'NodeView';

export { NodeView };
