import React from 'react';
import { Text } from 'react-native';
import { NestedRow } from './NestedRow';
import { render, waitFor } from '@testing-library/react-native';

describe('NestedListView', () => {
  test('renders with succesfully', async () => {
    const { getByText } = render(
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
    const { getByText } = render(
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
    const { getByText } = render(
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
