/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Node } from '../types';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { NestedListView } from './nested-list-view';
import { NestedRow } from '../nested-row';

const renderNode = (node: Node) => (
  <View>
    <Text>{node.title}</Text>
  </View>
);

describe('NestedListView', () => {
  test('renders with simple array', async () => {
    const data = [
      { title: 'child1' },
      { title: 'child2' },
      { title: 'child3' },
    ];
    const { queryByText } = await render(
      <NestedListView
        getChildrenName={() => 'items'}
        renderNode={(node: any) => (
          <View>
            <Text>{node.title}</Text>
          </View>
        )}
        data={data}
      />,
    );

    await waitFor(() => {
      [1, 2, 3].forEach((item: number) => {
        const component = queryByText(`child${item}`);
        expect(component).toBeDefined();
      });
    });
  });

  test('renders with an empty array', async () => {
    const data = [] as any;
    const { queryByText } = await render(
      <NestedListView
        getChildrenName={() => 'items'}
        renderNode={(node: any) => (
          <View>
            <Text>{node.title}</Text>
          </View>
        )}
        data={data}
      />,
    );

    await waitFor(() => {
      [1, 2, 3].forEach((item: number) => {
        const component = queryByText(`child${item}`);
        expect(component).toBeDefined();
      });
    });
  });

  test('renders with nested arrays', async () => {
    const data = [
      {
        title: 'child1',
        items: [{ name: 'subchild 1.1' }, { name: 'subchild 1.2' }],
      },
      { title: 'child2', items: [{ key: 'subchild 2.1' }] },
      { title: 'child3' },
    ];

    const { queryByText } = await render(
      <NestedListView
        getChildrenName={() => 'items'}
        renderNode={(node: any) => (
          <View>
            <Text>{node.title ?? node.name}</Text>
          </View>
        )}
        data={data}
      />,
    );

    const parent = queryByText('child1');
    expect(parent).toBeTruthy();

    expect(queryByText('subchild 1.1')).toBeNull();

    if (parent) {
      await fireEvent.press(parent);
    }

    await waitFor(() => {
      expect(queryByText('subchild 1.1')).toBeTruthy();
      expect(queryByText('subchild 1.2')).toBeTruthy();
    });
  });

  test('renders with nested arrays open and close', async () => {
    const data = [
      {
        title: 'child1',
        items: [{ name: 'subchild 1.1' }, { name: 'subchild 1.2' }],
      },
      { title: 'child2', items: [{ key: 'subchild 2.1' }] },
      { title: 'child3' },
    ];

    const { queryByText } = await render(
      <NestedListView
        getChildrenName={() => 'items'}
        renderNode={(node: any) => (
          <View>
            <Text>{node.title ?? node.name}</Text>
          </View>
        )}
        data={data}
      />,
    );

    const parent = queryByText('child1');
    expect(parent).toBeTruthy();

    // collapsed initially
    expect(queryByText('subchild 1.1')).toBeNull();

    if (parent) {
      await fireEvent.press(parent);
    }
    expect(queryByText('subchild 1.1')).toBeTruthy();

    if (parent) {
      await fireEvent.press(parent);
    }
    expect(queryByText('subchild 1.1')).toBeNull();
  });

  test('renders with nested arrays and children with different name', async () => {
    const data = [
      {
        title: 'child1',
        items: [{ name: 'subchild 1.1' }, { name: 'subchild 1.2' }],
      },
      {
        title: 'child2',
        descendants: [{ key: 'subchild 2.1', title: 'subchild 2.1' }],
      },
      { title: 'child3' },
    ];

    const { queryByText } = await render(
      <NestedListView
        getChildrenName={(node: Node) => {
          if (node.title === 'child2') {
            return 'descendants';
          }
          return 'items';
        }}
        renderNode={(node: Node) => (
          <View>
            <Text>{node.title}</Text>
          </View>
        )}
        data={data}
      />,
    );

    const parent = queryByText('child2');
    expect(parent).toBeTruthy();

    expect(queryByText('subchild 2.1')).toBeNull();

    if (parent) {
      await fireEvent.press(parent);
    }

    await waitFor(() => {
      expect(queryByText('subchild 2.1')).toBeTruthy();
    });
  });

  test('renders with nested arrays and children with different name that does not exists', async () => {
    const data = [
      {
        title: 'child1',
        items: [{ name: 'subchild 1.1' }, { name: 'subchild 1.2' }],
      },
      {
        title: 'child2',
        descendants: [{ key: 'subchild 2.1', title: 'subchild 2.1' }],
      },
      { title: 'child3' },
    ];

    const { queryByText } = await render(
      <NestedListView
        getChildrenName={(node: Node) => {
          if (node.title === 'child2') {
            return 'children';
          }
          return 'items';
        }}
        renderNode={(node: Node) => (
          <View>
            <Text>{node.title}</Text>
          </View>
        )}
        data={data}
      />,
    );
    const parent = queryByText('child2');
    expect(parent).toBeTruthy();

    if (parent) {
      await fireEvent.press(parent);
    }

    expect(queryByText('subchild 2.1')).toBeNull();
  });

  test('renders with children as objects', async () => {
    const data = [
      {
        name: 'Main Parent',
        children: {
          child1: {
            name: 'Main Child 1',
            children: {
              child1: {
                name: 'Sub Child 1',
                children: {},
              },
              child2: {
                name: 'Sub Child 2',
                children: {
                  subChild1: {
                    name: 'Sample',
                    children: {},
                  },
                },
              },
            },
          },
          child2: {
            name: 'Main Child 2',
            children: {
              child1: {
                name: 'Sub Child 1',
                children: {},
              },
              child2: {
                name: 'Sub Child 2',
                children: {},
              },
            },
          },
        },
      },
    ];

    const { queryByText } = await render(
      <NestedListView
        getChildrenName={() => 'children'}
        renderNode={(node: Node) => (
          <View>
            <Text>{node.name}</Text>
          </View>
        )}
        data={data}
      />,
    );

    const parent = queryByText('Main Parent');
    expect(parent).toBeTruthy();

    if (parent) {
      await fireEvent.press(parent);
    }

    const firstChild = queryByText('Main Child 1');
    expect(firstChild).toBeTruthy();

    if (firstChild) {
      await fireEvent.press(firstChild);
    }

    await waitFor(() => {
      expect(queryByText('Sub Child 2')).toBeTruthy();
    });
  });

  test('onNodePressed should be called when press a node', async () => {
    const data = [
      { title: 'child1' },
      { title: 'child2' },
      { title: 'child3' },
    ];

    const mockOnNodePressed = jest.fn();

    const { queryByText } = await render(
      <NestedListView
        onNodePressed={mockOnNodePressed}
        renderNode={(node: Node) => (
          <View>
            <Text>{node.title}</Text>
          </View>
        )}
        data={data}
      />,
    );

    const component = queryByText('child1');
    expect(component).toBeDefined();

    if (component) {
      await fireEvent.press(component);
    }

    expect(mockOnNodePressed).toHaveBeenCalledTimes(1);
  });

  test('onNodePressed should be called when press a node and keepOpenedState is true', async () => {
    const data = [
      { title: 'child1' },
      { title: 'child2' },
      { title: 'child3' },
    ];

    const mockOnNodePressed = jest.fn();

    const { queryByText } = await render(
      <NestedListView
        keepOpenedState
        onNodePressed={mockOnNodePressed}
        renderNode={(node: Node) => (
          <View>
            <Text>{node.title}</Text>
          </View>
        )}
        data={data}
      />,
    );

    const component = queryByText('child1');
    expect(component).toBeDefined();

    if (component) {
      await fireEvent.press(component);
    }

    expect(mockOnNodePressed).toHaveBeenCalledTimes(1);
  });

  test('renders with NestedRow', async () => {
    const data = [
      { title: 'child1' },
      { title: 'child2' },
      { title: 'child3' },
    ];

    const mockOnNodePressed = jest.fn();

    const { queryByText } = await render(
      <NestedListView
        onNodePressed={mockOnNodePressed}
        renderNode={(node: Node, level?: number) => (
          <NestedRow level={level}>
            <Text>{node.title}</Text>
          </NestedRow>
        )}
        data={data}
      />,
    );

    expect(queryByText('child1')).toBeTruthy();
    expect(queryByText('child2')).toBeTruthy();
    expect(queryByText('child3')).toBeTruthy();
  });

  test('renders without renderNode', async () => {
    const data = [
      { title: 'child1' },
      { title: 'child2' },
      { title: 'child3' },
    ];

    const { queryByText } = await render(
      <NestedListView
        // @ts-ignore
        renderNode={null}
        data={data}
      />,
    );

    const component = queryByText('prop renderNode has not been passed');
    expect(component).toBeDefined();
  });

  test('renders without data', async () => {
    const { queryByText } = await render(
      <NestedListView
        renderNode={renderNode}
        // @ts-ignore
        data={null}
      />,
    );

    const component = queryByText('prop data has not been passed');
    expect(component).toBeDefined();
  });

  test('renders with isLast renderNode', async () => {
    const data = [
      {
        title: 'child1',
        items: [{ title: 'subchild 1.1' }, { title: 'subchild 1.2' }],
      },
    ];

    const mockIsTheLast = jest.fn();

    const { getByText } = await render(
      <NestedListView
        renderNode={(item: Node, level: number, isLastItem: boolean) => {
          mockIsTheLast(isLastItem);

          return (
            <NestedRow level={level}>
              <Text>{item.title}</Text>
            </NestedRow>
          );
        }}
        data={data}
      />,
    );

    const child1 = getByText('child1');

    // a node that has children is not the last level
    expect(mockIsTheLast).toHaveBeenLastCalledWith(false);

    await fireEvent.press(child1);

    await waitFor(() => {
      // ...but its expanded leaves are
      expect(mockIsTheLast).toHaveBeenLastCalledWith(true);
    });
  });
});

/** A single chain of `depth` nodes, every one of them already expanded. */
const chainOfDepth = (depth: number) => {
  const root: any = { title: 'n0', opened: true, items: [] };
  let cursor = root;

  for (let level = 1; level < depth; level++) {
    const child = { title: `n${level}`, opened: true, items: [] as any[] };
    cursor.items.push(child);
    cursor = child;
  }

  return [root];
};

const siblings = (count: number, prefix = 'w') =>
  Array.from({ length: count }, (_unused, index) => ({
    title: `${prefix}${index}`,
  }));

describe('NestedListView as a flat list', () => {
  test('hands a single list the whole visible tree, flattened', async () => {
    // The whole point of the exercise. This used to be one VirtualizedList per
    // node, nested as deeply as the data, each one receiving only its own
    // node's children. Now one list receives every visible row, and depth is
    // carried by a number on the row rather than by the component tree.
    const received: any[] = [];
    const ListComponent = (props: any) => {
      received.push(props);
      return <FlatList {...props} />;
    };

    await render(
      <NestedListView
        data={chainOfDepth(40)}
        ListComponent={ListComponent}
        renderNode={(node: Node) => <Text>{node.title}</Text>}
      />,
    );

    const rows = received[0].data;

    expect(rows).toHaveLength(40);
    expect(rows.map((row: any) => row.level)).toEqual(
      Array.from({ length: 40 }, (_unused, index) => index + 1),
    );
    expect(rows.map((row: any) => row.node.title)).toEqual(
      Array.from({ length: 40 }, (_unused, index) => `n${index}`),
    );
  });

  test('emits no nested-list complaint for a deep tree', async () => {
    // A guard rather than a proof: React Native only complains about nesting
    // once a real ScrollView is involved, which the test renderer does not
    // always reach. It still catches a reintroduced nested list, and duplicate
    // React keys, which is what ids derived from node content used to cause.
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    await render(
      <NestedListView
        data={chainOfDepth(40)}
        renderNode={(node: Node) => <Text>{node.title}</Text>}
      />,
    );

    const said = [...error.mock.calls, ...warn.mock.calls]
      .map((call) => String(call[0]))
      .join('\n');

    expect(said).not.toMatch(/nested/i);
    expect(said).not.toMatch(/VirtualizedList/);

    error.mockRestore();
    warn.mockRestore();
  });

  test('mounts a bounded number of rows for a wide tree', async () => {
    const view = await render(
      <NestedListView
        data={siblings(500)}
        initialNumToRender={7}
        renderNode={(node: Node) => <Text>{node.title}</Text>}
      />,
    );

    expect(view.queryAllByText(/^w\d+$/)).toHaveLength(7);
  });

  test('mounts a bounded number of rows for a tree deeper than the window', async () => {
    const view = await render(
      <NestedListView
        data={chainOfDepth(20000)}
        initialNumToRender={5}
        renderNode={(node: Node) => <Text>{node.title}</Text>}
      />,
    );

    // The old design mounted a list per level, so every one of these 20000
    // nodes was mounted at once. Depth now costs nothing that is off screen.
    expect(view.queryAllByText(/^n\d+$/)).toHaveLength(5);
  });

  test('passes level 1 to the nodes of data and deeper levels below', async () => {
    const levels: Record<string, number> = {};

    const view = await render(
      <NestedListView
        data={[{ title: 'a', items: [{ title: 'a1' }] }]}
        renderNode={(node: Node, level: number) => {
          levels[node.title] = level;
          return <Text>{node.title}</Text>;
        }}
      />,
    );

    expect(levels).toEqual({ a: 1 });

    await fireEvent.press(view.getByText('a'));

    expect(levels).toEqual({ a: 1, a1: 2 });
  });

  test('indents a top-level row by one increment, via NestedRow', async () => {
    // The user-visible consequence of levels starting at 1. This is the test
    // that would fail if TOP_LEVEL were changed to 0, which is the whole reason
    // the base is written down rather than inherited.
    const paddingOfRowContaining = (view: any, text: string) => {
      let node = view.getByText(text).parent;

      while (node) {
        const style = StyleSheet.flatten(node.props?.style) as any;

        if (style && style.paddingLeft !== undefined) {
          return style.paddingLeft;
        }

        node = node.parent;
      }

      return undefined;
    };

    const view = await render(
      <NestedListView
        data={[{ title: 'top', items: [{ title: 'nested' }] }]}
        renderNode={(node: Node, level: number) => (
          <NestedRow level={level}>
            <Text>{node.title}</Text>
          </NestedRow>
        )}
      />,
    );

    expect(paddingOfRowContaining(view, 'top')).toBe(10);

    await fireEvent.press(view.getByText('top'));

    expect(paddingOfRowContaining(view, 'nested')).toBe(20);
  });

  test('renders through a ListComponent when one is given', async () => {
    const ListComponent = jest.fn(
      ({ data, renderItem }: { data: any[]; renderItem: any }) => (
        <View testID="custom-list">
          {data.map((item: any) => (
            <View key={item.id}>{renderItem({ item })}</View>
          ))}
        </View>
      ),
    );

    const view = await render(
      <NestedListView
        data={[{ title: 'a' }, { title: 'b' }]}
        ListComponent={ListComponent}
        renderNode={(node: Node) => <Text>{node.title}</Text>}
      />,
    );

    expect(ListComponent).toHaveBeenCalled();
    expect(view.getByTestId('custom-list')).toBeTruthy();
    expect(view.getByText('a')).toBeTruthy();
    expect(view.getByText('b')).toBeTruthy();
  });

  test('expands only the sibling that was pressed, when siblings match', async () => {
    // Ids were a hash of node content, so identical siblings shared one id and
    // expanding either expanded both.
    const identical = () => ({ title: 'same', items: [{ title: 'child' }] });

    const view = await render(
      <NestedListView
        data={[identical(), identical()]}
        renderNode={(node: Node) => <Text>{node.title}</Text>}
      />,
    );

    expect(view.queryAllByText('same')).toHaveLength(2);
    expect(view.queryAllByText('child')).toHaveLength(0);

    await fireEvent.press(view.queryAllByText('same')[0]);

    expect(view.queryAllByText('child')).toHaveLength(1);
  });

  test('keeps a node expanded across a data change with keepOpenedState', async () => {
    const tree = (suffix: string) => [
      { title: 'a', id: 'a', items: [{ title: `a1${suffix}`, id: 'a1' }] },
    ];

    const view = await render(
      <NestedListView
        keepOpenedState
        data={tree('')}
        renderNode={(node: Node) => <Text>{node.title}</Text>}
      />,
    );

    await fireEvent.press(view.getByText('a'));
    expect(view.queryByText('a1')).toBeTruthy();

    await view.rerender(
      <NestedListView
        keepOpenedState
        data={tree('-changed')}
        renderNode={(node: Node) => <Text>{node.title}</Text>}
      />,
    );

    expect(view.queryByText('a1-changed')).toBeTruthy();
  });

  test("forgets a collapsed node's descendants without keepOpenedState", async () => {
    // Collapsing a node used to unmount its descendants and discard the state
    // they held, and that is still what happens by default.
    const data = [
      { title: 'a', items: [{ title: 'a1', items: [{ title: 'a1i' }] }] },
    ];

    const view = await render(
      <NestedListView
        data={data}
        renderNode={(node: Node) => <Text>{node.title}</Text>}
      />,
    );

    await fireEvent.press(view.getByText('a'));
    await fireEvent.press(view.getByText('a1'));
    expect(view.queryByText('a1i')).toBeTruthy();

    await fireEvent.press(view.getByText('a'));
    await fireEvent.press(view.getByText('a'));

    expect(view.queryByText('a1')).toBeTruthy();
    expect(view.queryByText('a1i')).toBeNull();
  });

  test("remembers a collapsed node's descendants with keepOpenedState", async () => {
    const data = [
      { title: 'a', items: [{ title: 'a1', items: [{ title: 'a1i' }] }] },
    ];

    const view = await render(
      <NestedListView
        keepOpenedState
        data={data}
        renderNode={(node: Node) => <Text>{node.title}</Text>}
      />,
    );

    await fireEvent.press(view.getByText('a'));
    await fireEvent.press(view.getByText('a1'));
    expect(view.queryByText('a1i')).toBeTruthy();

    await fireEvent.press(view.getByText('a'));
    await fireEvent.press(view.getByText('a'));

    expect(view.queryByText('a1i')).toBeTruthy();
  });

  test('does not walk the tree again when only renderNode changes', async () => {
    // The previous implementation re-hashed every node whenever renderNode
    // changed identity, which for an inline arrow meant on every parent render.
    const data = [{ title: 'a', items: [{ title: 'a1' }] }];
    const getChildrenName = jest.fn(() => 'items');

    const view = await render(
      <NestedListView
        data={data}
        getChildrenName={getChildrenName}
        renderNode={(node: Node) => <Text>{node.title}</Text>}
      />,
    );

    const walkedOnce = getChildrenName.mock.calls.length;
    expect(walkedOnce).toBeGreaterThan(0);

    await view.rerender(
      <NestedListView
        data={data}
        getChildrenName={getChildrenName}
        renderNode={(node: Node) => <Text>{node.title} </Text>}
      />,
    );

    expect(getChildrenName).toHaveBeenCalledTimes(walkedOnce);
  });

  test('walks the tree again when extraData changes', async () => {
    const data = [{ title: 'a', items: [{ title: 'a1' }] }];
    const getChildrenName = jest.fn(() => 'items');
    const renderTitle = (node: Node) => <Text>{node.title}</Text>;

    const view = await render(
      <NestedListView
        data={data}
        extraData={1}
        getChildrenName={getChildrenName}
        renderNode={renderTitle}
      />,
    );

    const walkedOnce = getChildrenName.mock.calls.length;

    await view.rerender(
      <NestedListView
        data={data}
        extraData={2}
        getChildrenName={getChildrenName}
        renderNode={renderTitle}
      />,
    );

    expect(getChildrenName.mock.calls.length).toBeGreaterThan(walkedOnce);
  });

  test('re-renders the rows that appeared, not the rows that did not move', async () => {
    const rendered: Record<string, number> = {};
    const countRender = (node: Node) => {
      rendered[node.title] = (rendered[node.title] ?? 0) + 1;
      return <Text>{node.title}</Text>;
    };

    const view = await render(
      <NestedListView
        data={[
          { title: 'a', items: [{ title: 'a1' }, { title: 'a2' }] },
          { title: 'b' },
        ]}
        renderNode={countRender}
      />,
    );

    const untouched = rendered.b;

    await fireEvent.press(view.getByText('a'));

    expect(rendered.a1).toBe(1);
    expect(rendered.a2).toBe(1);
    expect(rendered.b).toBe(untouched);
  });

  test('keeps a node expanded while its own content changes', async () => {
    // State used to be keyed by a hash of node content, which was also the React
    // key, so changing a node's content remounted it and lost its state.
    const tree = (title: string) => [
      { id: 'a', title, items: [{ id: 'a1', title: 'a1' }] },
    ];

    const view = await render(
      <NestedListView
        data={tree('first')}
        renderNode={(node: Node) => <Text>{node.title}</Text>}
      />,
    );

    await fireEvent.press(view.getByText('first'));
    expect(view.queryByText('a1')).toBeTruthy();

    await view.rerender(
      <NestedListView
        data={tree('second')}
        renderNode={(node: Node) => <Text>{node.title}</Text>}
      />,
    );

    expect(view.queryByText('second')).toBeTruthy();
    expect(view.queryByText('a1')).toBeTruthy();
  });

  test('applies style to the list', async () => {
    // The prop was declared but never used.
    const received: any[] = [];
    const ListComponent = (props: any) => {
      received.push(props);
      return <FlatList {...props} />;
    };

    await render(
      <NestedListView
        data={[{ title: 'a' }]}
        style={{ backgroundColor: 'rebeccapurple' }}
        ListComponent={ListComponent}
        renderNode={(node: Node) => <Text>{node.title}</Text>}
      />,
    );

    expect(received[0].style).toEqual({ backgroundColor: 'rebeccapurple' });
  });

  test('uses keyExtractor for node identity', async () => {
    const view = await render(
      <NestedListView
        data={[{ title: 'a', items: [{ title: 'a1' }] }]}
        keyExtractor={(node: Node) => `by-title-${node.title}`}
        renderNode={(node: Node) => <Text>{node._internalId}</Text>}
      />,
    );

    expect(view.getByText('by-title-a')).toBeTruthy();

    await fireEvent.press(view.getByText('by-title-a'));

    expect(view.getByText('by-title-a/by-title-a1')).toBeTruthy();
  });
});
