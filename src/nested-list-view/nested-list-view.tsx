import React, { ReactElement, useCallback, useRef } from 'react';
import {
  FlatList,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { useFlattenedRows } from '../expansion';
import { Node, Row } from '../types';

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
  renderNode: (item: Node, level: number, isLastLevel: boolean) => ReactElement;
  onNodePressed?: (item: Node) => void;
  /**
   * Where a node's children live. Defaults to `items`.
   *
   * Read when the rows are built, which happens on a change to `data` or
   * `extraData` — not on every render, since this is usually an inline arrow and
   * rebuilding on its identity would walk the tree on every render of the
   * parent. If this starts answering differently without `data` changing, change
   * `extraData` to pick it up.
   */
  getChildrenName?: (item: Node) => string;
  /**
   * Identity of a node within its parent, used to keep expanded state attached
   * to the right node when `data` changes. Defaults to the node's own `id` or
   * `key`, and then to its position among its siblings.
   *
   * Read when the rows are built, on the same terms as `getChildrenName`.
   */
  keyExtractor?: (item: Node, index: number) => string | number;
  style?: StyleProp<ViewStyle>;
  keepOpenedState?: boolean;
  initialNumToRender?: number;
  /**
   * The list used to render the rows. Defaults to `FlatList`. Because the tree
   * is flattened first, anything with a `FlatList`-shaped API works here —
   * `LegendList` or `FlashList`, for instance, to get their recycling.
   */
  ListComponent?: React.ComponentType<any>;
}

interface INestedListRowProps {
  row: Row;
  renderNode: IProps['renderNode'];
  onPress: (row: Row) => void;
}

/**
 * One row.
 *
 * Memoized, and given a `row` whose identity only changes when that node's own
 * content or expanded state changes, so expanding a node re-renders the rows
 * that appeared rather than every row on screen.
 */
const NestedListRow: React.FC<INestedListRowProps> = React.memo(
  ({ row, renderNode, onPress }) => {
    const handlePress = useCallback(() => onPress(row), [onPress, row]);

    return (
      <Pressable onPress={handlePress}>
        {renderNode(row.node, row.level, row.isLastLevel)}
      </Pressable>
    );
  },
);

NestedListRow.displayName = 'NestedListRow';

const renderErrorMessage = (prop: string) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>prop {prop} has not been passed</Text>
  </View>
);

const extractRowKey = (row: Row) => row.id;

/**
 * A list of nested nodes.
 *
 * The tree is flattened into a single array of visible rows and handed to one
 * list. It used to be rendered as a `VirtualizedList` per node, nested as deeply
 * as the data — the arrangement React Native warns against, where virtualization
 * cannot window correctly and cost grows with the size of the tree rather than
 * with what is on screen.
 */
const NestedListView: React.FC<IProps> = React.memo(
  ({
    data,
    extraData,
    renderNode,
    onNodePressed,
    getChildrenName,
    keyExtractor,
    style,
    keepOpenedState,
    initialNumToRender,
    ListComponent = FlatList,
  }: IProps) => {
    const { rows, toggle } = useFlattenedRows({
      data,
      extraData,
      getChildrenName,
      keyExtractor,
      keepOpenedState,
    });

    // Held in a ref so that an inline `onNodePressed` does not change the press
    // handler on every render, which would re-render every mounted row.
    const onNodePressedRef = useRef(onNodePressed);

    onNodePressedRef.current = onNodePressed;

    const handlePress = useCallback(
      (row: Row) => {
        toggle(row);

        if (onNodePressedRef.current) {
          // The node as it was rendered, so `opened` is its state before the
          // press — which is what the callback has always received.
          onNodePressedRef.current(row.node);
        }
      },
      [toggle],
    );

    const renderItem = useCallback(
      ({ item }: { item: Row }) => (
        <NestedListRow
          row={item}
          renderNode={renderNode}
          onPress={handlePress}
        />
      ),
      [renderNode, handlePress],
    );

    if (!renderNode) {
      return renderErrorMessage('renderNode');
    }

    if (!data) {
      return renderErrorMessage('data');
    }

    return (
      <ListComponent
        data={rows}
        renderItem={renderItem}
        keyExtractor={extractRowKey}
        extraData={extraData}
        initialNumToRender={initialNumToRender}
        style={style}
      />
    );
  },
);

NestedListView.displayName = 'NestedListView';

export { NestedListView };
