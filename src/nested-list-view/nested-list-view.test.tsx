/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { Text, View } from 'react-native';
import { Node } from '../node-view';
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

  test('forwards listViewProps to the underlying lists', async () => {
    const data = [{ title: 'child1', items: [{ title: 'subchild 1.1' }] }];

    const { getAllByTestId } = await render(
      <NestedListView
        getChildrenName={() => 'items'}
        listViewProps={{
          testID: 'inner-list',
          showsVerticalScrollIndicator: false,
        }}
        renderNode={(node: Node) => (
          <View>
            <Text>{node.title}</Text>
          </View>
        )}
        data={data}
      />,
    );

    const lists = getAllByTestId('inner-list');
    expect(lists.length).toBeGreaterThan(0);
    expect(lists[0].props.showsVerticalScrollIndicator).toBe(false);
  });

  test('listViewProps cannot override the props the list controls', async () => {
    const data = [{ title: 'child1' }, { title: 'child2' }];

    const { queryByText } = await render(
      <NestedListView
        // deliberately hostile: these must not win over the component's own
        // @ts-ignore
        listViewProps={{ data: [], renderItem: () => null }}
        renderNode={(node: Node) => (
          <View>
            <Text>{node.title}</Text>
          </View>
        )}
        data={data}
      />,
    );

    expect(queryByText('child1')).toBeTruthy();
    expect(queryByText('child2')).toBeTruthy();
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
