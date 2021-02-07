import * as React from 'react';
import { Text } from 'react-native';
import { NestedRow } from './NestedRow';
import { render, waitFor } from '@testing-library/react-native';

describe('NestedListView', () => {
  test('renders with succesfully', async () => {
    const { UNSAFE_getByType } = render(
      <NestedRow level={1} style={{ borderColor: 'black', borderWidth: 1 }}>
        <Text>Test</Text>
      </NestedRow>,
    );

    await waitFor(() => {
      const component = UNSAFE_getByType(NestedRow);
      expect(component).toBeDefined();
    });
  });

  test('renders without level passed', async () => {
    const { UNSAFE_getByType } = render(
      <NestedRow style={{ borderColor: 'black', borderWidth: 1 }}>
        <Text>Test</Text>
      </NestedRow>,
    );

    await waitFor(() => {
      const component = UNSAFE_getByType(NestedRow);
      expect(component).toBeDefined();
    });
  });

  test('renders with height passed', async () => {
    const { UNSAFE_getByType } = render(
      <NestedRow
        level={1}
        height={60}
        paddingLeftIncrement={15}
        style={{ borderColor: 'black', borderWidth: 1 }}>
        <Text>Test</Text>
      </NestedRow>,
    );

    await waitFor(() => {
      const component = UNSAFE_getByType(NestedRow);
      expect(component).toBeDefined();
    });
  });
});
