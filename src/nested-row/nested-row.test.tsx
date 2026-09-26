import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { NestedRow } from './nested-row';
import { render, waitFor } from '@testing-library/react-native';

/** The composed style actually applied to the row's container. */
const styleOf = (view: { toJSON: () => any }) =>
  StyleSheet.flatten(view.toJSON().props.style) as Record<string, any>;

describe('NestedListView', () => {
  test('renders with succesfully', async () => {
    const { getByText } = await render(
      <NestedRow level={1} style={{ borderColor: 'black', borderWidth: 1 }}>
        <Text>Test</Text>
      </NestedRow>,
    );

    await waitFor(() => {
      const component = getByText('Test');
      expect(component).toBeTruthy();
    });
  });

  test('renders without level passed', async () => {
    const { getByText } = await render(
      <NestedRow style={{ borderColor: 'black', borderWidth: 1 }}>
        <Text>Test</Text>
      </NestedRow>,
    );

    await waitFor(() => {
      const component = getByText('Test');
      expect(component).toBeTruthy();
    });
  });

  test('renders with height passed', async () => {
    const { getByText } = await render(
      <NestedRow
        level={1}
        height={60}
        paddingLeftIncrement={15}
        style={{ borderColor: 'black', borderWidth: 1 }}>
        <Text>Test</Text>
      </NestedRow>,
    );

    await waitFor(() => {
      const component = getByText('Test');
      expect(component).toBeTruthy();
    });
  });
});

describe('NestedRow indentation and defaults', () => {
  test('indents by one increment per level', async () => {
    // Top-level nodes are at level 1, so a top-level row is already indented by
    // one increment. That base is deliberate; see "Why levels start at 1" in the
    // README and TOP_LEVEL in src/flatten/flatten.ts.
    const atLevel = async (level: number) =>
      styleOf(
        await render(
          <NestedRow level={level}>
            <Text>Test</Text>
          </NestedRow>,
        ),
      ).paddingLeft;

    expect(await atLevel(0)).toBe(0);
    expect(await atLevel(1)).toBe(10);
    expect(await atLevel(3)).toBe(30);
  });

  test('level defaults to 0, not to being required', async () => {
    const view = await render(
      <NestedRow>
        <Text>Test</Text>
      </NestedRow>,
    );

    expect(styleOf(view).paddingLeft).toBe(0);
  });

  test('paddingLeftIncrement defaults to 10 and can be replaced', async () => {
    const view = await render(
      <NestedRow level={2} paddingLeftIncrement={25}>
        <Text>Test</Text>
      </NestedRow>,
    );

    expect(styleOf(view).paddingLeft).toBe(50);
  });

  test('has no default height, so the row sizes to its content', async () => {
    // The README claimed a default of 50 for years. There is none, and adding
    // one now would resize every row in every app that omits it.
    const view = await render(
      <NestedRow level={1}>
        <Text>Test</Text>
      </NestedRow>,
    );

    expect(styleOf(view).height).toBeUndefined();
  });

  test('applies height when one is given', async () => {
    const view = await render(
      <NestedRow level={1} height={60}>
        <Text>Test</Text>
      </NestedRow>,
    );

    expect(styleOf(view).height).toBe(60);
  });

  test('renders without children', async () => {
    const view = await render(<NestedRow level={1} />);

    expect(styleOf(view).paddingLeft).toBe(10);
  });
});
