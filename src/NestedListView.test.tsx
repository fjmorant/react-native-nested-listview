import * as React from 'react';
import { Text, View } from 'react-native';
import NestedListView, { NestedRow } from '.';
import { render, waitFor, fireEvent } from '@testing-library/react-native';

let mockCounter = 0;

jest.mock('shortid', () => ({
  generate: () => `${mockCounter++}`,
}));

const renderNode = (node: any) => (
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
    const { queryByText } = render(
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

    const { queryByText } = render(
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

    await waitFor(() => {
      const parent = queryByText('child1');

      if (parent) {
        fireEvent.press(parent);
      }

      const component1 = queryByText('subchild 1.1');
      expect(component1).toBeDefined();

      const component2 = queryByText('subchild 1.2');
      expect(component2).toBeDefined();
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

    const { queryByText } = render(
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

    await waitFor(() => {
      const parent = queryByText('child1');

      expect(queryByText('subchild 1.1')).toBeDefined();

      if (parent) {
        fireEvent.press(parent);
      }

      expect(queryByText('subchild 1.1')).toBeDefined();
    });
  });

  test('renders with nested arrays and children with different name', async () => {
    const data = [
      {
        title: 'child1',
        items: [{ name: 'subchild 1.1' }, { name: 'subchild 1.2' }],
      },
      { title: 'child2', descendants: [{ key: 'subchild 2.1' }] },
      { title: 'child3' },
    ];

    const { queryByText } = render(
      <NestedListView
        getChildrenName={(node: any) => {
          if (node.title === 'child2') {
            return 'descendants';
          }
          return 'items';
        }}
        renderNode={(node: any) => (
          <View>
            <Text>{node.title}</Text>
          </View>
        )}
        data={data}
      />,
    );

    await waitFor(() => {
      const parent = queryByText('child2');

      if (parent) {
        fireEvent.press(parent);
      }

      const children = parent?.children;
      expect(children?.length).toEqual(1);
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

    const { queryByText } = render(
      <NestedListView
        getChildrenName={(node: any) => {
          if (node.title === 'child2') {
            return 'children';
          }
          return 'items';
        }}
        renderNode={(node: any) => (
          <View>
            <Text>{node.title}</Text>
          </View>
        )}
        data={data}
      />,
    );
    let parent: any;
    await waitFor(() => {
      parent = queryByText('child2');

      fireEvent.press(parent);

      const child = queryByText('subchild 2.1');

      expect(child).toBeNull();
    });
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

    const { queryByText } = render(
      <NestedListView
        getChildrenName={() => 'children'}
        renderNode={(node: any) => (
          <View>
            <Text>{node.name}</Text>
          </View>
        )}
        data={data}
      />,
    );

    await waitFor(() => {
      const parent = queryByText('Main Parent');

      if (parent) {
        fireEvent.press(parent);
      }

      const firstChild = queryByText('Main Child 1');
      expect(firstChild).toBeDefined();

      if (firstChild) {
        fireEvent.press(firstChild);
      }

      const secondChild = queryByText('Sub Child 2');
      expect(secondChild).toBeDefined();
    });
  });

  test('onNodePressed should be called when press a node', async () => {
    const data = [
      { title: 'child1' },
      { title: 'child2' },
      { title: 'child3' },
    ];

    const mockOnNodePressed = jest.fn();

    const { queryByText } = render(
      <NestedListView
        onNodePressed={mockOnNodePressed}
        renderNode={(node: any) => (
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
      fireEvent.press(component);
    }

    expect(mockOnNodePressed).toBeCalledTimes(1);
  });

  test('renders with NestedRow', async () => {
    const data = [
      { title: 'child1' },
      { title: 'child2' },
      { title: 'child3' },
    ];

    const mockOnNodePressed = jest.fn();

    const { UNSAFE_queryAllByType } = render(
      <NestedListView
        onNodePressed={mockOnNodePressed}
        renderNode={(node: any, level?: number) => (
          <NestedRow level={level}>{node.name}</NestedRow>
        )}
        data={data}
      />,
    );

    const component = UNSAFE_queryAllByType(NestedRow);
    expect(component.length).toEqual(3);
  });

  test('renders without renderNode', async () => {
    const data = [
      { title: 'child1' },
      { title: 'child2' },
      { title: 'child3' },
    ];

    const { queryByText } = render(
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
    const { queryByText } = render(
      <NestedListView
        renderNode={renderNode}
        // @ts-ignore
        data={null}
      />,
    );

    const component = queryByText('prop data has not been passed');
    expect(component).toBeDefined();
  });
});
