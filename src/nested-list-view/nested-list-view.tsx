import hashObjectGenerator from 'object-hash';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { INode, NodeView } from '../node-view';
import { NodeProvider } from '../nodes-context-provider';

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
});

export interface IProps {
  data: any;
  extraData?: any;
  renderNode: (
    item: INode,
    level: number,
    isLastLevel: boolean,
  ) => ReactElement;
  onNodePressed?: (item: INode) => void;
  getChildrenName?: (item: INode) => string;
  style?: StyleSheet;
  keepOpenedState?: boolean;
  initialNumToRender?: number;
}

const DEFAULT_CHILDREN_NAME = 'items';

const defaultRootNode = {
  _internalId: 'root',
  items: [],
  name: 'root',
  opened: true,
  hidden: true,
} as INode;

const NestedListView: React.FC<IProps> = React.memo(
  ({
    getChildrenName,
    renderNode,
    data,
    onNodePressed,
    extraData,
    keepOpenedState,
    initialNumToRender,
  }: IProps) => {
    const generateIds = useCallback(
      (node?: INode) => {
        if (!node) {
          return {
            _internalId: '',
          };
        }

        const copyNode = { ...node };

        const childrenName = getChildrenName
          ? getChildrenName(node)
          : DEFAULT_CHILDREN_NAME;
        let children = node[childrenName];

        if (children) {
          if (!Array.isArray(children)) {
            children = Object.keys(children).map(
              (key: string) => children[key],
            );
          }
          copyNode[childrenName] = children.map((_: INode, index: number) =>
            generateIds(children[index]),
          );
        }

        if (copyNode._internalId) {
          // @ts-ignore
          delete copyNode._internalId;
        }

        copyNode._internalId = keepOpenedState
          ? hashObjectGenerator(copyNode)
          : Math.random().toString(36).substring(2, 10);

        return copyNode;
      },
      [getChildrenName, keepOpenedState],
    );

    const generateRootNode = useCallback(
      (props: IProps): INode => {
        return {
          _internalId: 'root',
          items: props.data
            ? props.data.map((item: any) => generateIds(item))
            : [],
          name: 'root',
          opened: true,
          hidden: true,
        };
      },
      [generateIds],
    );

    const [_root, setRoot]: [INode, (_rootNode: INode) => void] =
      useState(defaultRootNode);

    useEffect(() => {
      const time = Date.now();
      const newNode = generateRootNode({
        getChildrenName,
        renderNode,
        data,
        onNodePressed,
        extraData,
      });

      console.log('Spent time => ', Date.now() - time);
      setRoot(newNode);
    }, [
      data,
      extraData,
      getChildrenName,
      renderNode,
      onNodePressed,
      generateRootNode,
    ]);

    const _getChildrenName = useCallback(
      (node: INode) => {
        if (node.name === 'root') {
          return 'items';
        }

        return getChildrenName ? getChildrenName(node) : 'items';
      },
      [getChildrenName],
    );

    const renderErrorMessage = (prop: string) => {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>prop {prop} has not been passed</Text>
        </View>
      );
    };

    if (!renderNode) {
      return renderErrorMessage('renderNode');
    }

    if (!data) {
      return renderErrorMessage('data');
    }

    return (
      <NodeProvider>
        <NodeView
          getChildrenName={_getChildrenName}
          node={_root}
          onNodePressed={onNodePressed}
          level={0}
          renderNode={renderNode}
          extraData={extraData}
          keepOpenedState={keepOpenedState}
          initialNumToRender={initialNumToRender}
        />
      </NodeProvider>
    );
  },
);

NestedListView.displayName = 'NestedListView';

export { NestedListView };
