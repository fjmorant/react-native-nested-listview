import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { Pressable, VirtualizedList } from 'react-native';
import { useNodesContext } from '../nodes-context-provider';
import { Node } from './types';

export interface IProps {
  getChildrenName: (item: Node) => string;
  node: Node;
  level: number;
  onNodePressed?: (item: Node) => void;
  renderNode: (item: Node, level: number, isLastLevel: boolean) => ReactElement;
  renderChildrenNode?: (item: Node) => ReactElement;
  extraData?: any;
  keepOpenedState?: boolean;
  initialNumToRender?: number;
}

const NodeView: React.FC<IProps> = React.memo(
  ({
    renderNode,
    extraData,
    level,
    getChildrenName,
    node,
    onNodePressed,
    keepOpenedState,
    initialNumToRender,
  }) => {
    const { openedNodes, setOpenNode } = useNodesContext();
    const [_node, setNode]: [Node, any] = useState({
      ...node,
      opened:
        keepOpenedState && openedNodes[node._internalId]
          ? !!openedNodes[node._internalId]
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
        setOpenNode &&
          setOpenNode({
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
    }, [_node, keepOpenedState, onNodePressed, setOpenNode]);

    const renderChildren = useCallback(
      (item: Node, _level: number): ReactElement => (
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
      ({ item }: { item: Node }) => renderChildren(item, level),
      [renderChildren, level],
    );

    const getItem = useCallback((data, index) => data && data[index], []);

    const getItemCount = useCallback((data) => data?.length, []);

    const keyExtractor = useCallback((item: Node) => item._internalId, []);

    const nodeChildrenName = getChildrenName(_node);
    const nodeChildren: [] = _node[nodeChildrenName];

    const isNodeOpened =
      (keepOpenedState && openedNodes[node._internalId]) || _node.opened;

    return (
      <>
        {!_node.hidden ? (
          <Pressable onPress={_onNodePressed}>
            {renderNode(_node, level, !nodeChildren || !nodeChildren.length)}
          </Pressable>
        ) : null}
        {isNodeOpened && nodeChildren ? (
          <VirtualizedList
            data={nodeChildren}
            getItemCount={getItemCount}
            getItem={getItem}
            renderItem={renderItem}
            extraData={extraData}
            keyExtractor={keyExtractor}
            listKey={node._internalId}
            initialNumToRender={initialNumToRender}
          />
        ) : null}
      </>
    );
  },
);

NodeView.displayName = 'NodeView';

export { NodeView };
