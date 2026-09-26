import React from 'react';
import { Text } from 'react-native';
import { act, render } from '@testing-library/react-native';
import {
  useSyncExternalStore,
  useSyncExternalStoreFallback,
} from './use-sync-external-store';

const createStore = (initial: number, bumpOnSubscribe = false) => {
  const listeners = new Set<() => void>();
  let value = initial;

  return {
    getSnapshot: () => value,
    subscribe: (listener: () => void) => {
      listeners.add(listener);

      if (bumpOnSubscribe) {
        value += 1;
      }

      return () => {
        listeners.delete(listener);
      };
    },
    set: (next: number) => {
      value = next;
      listeners.forEach((listener) => listener());
    },
  };
};

const Probe = ({ store }: { store: ReturnType<typeof createStore> }) => {
  const value = useSyncExternalStoreFallback(
    store.subscribe,
    store.getSnapshot,
  );

  return <Text>value {value}</Text>;
};

describe('useSyncExternalStore', () => {
  test('uses the hook React provides when there is one', () => {
    // React 18 and later. The fallback exists only for the declared `react >=17`
    // floor, and must not shadow the real thing where it exists.
    expect(useSyncExternalStore).toBe(
      (React as unknown as { useSyncExternalStore: unknown })
        .useSyncExternalStore,
    );
  });
});

describe('useSyncExternalStoreFallback', () => {
  test('renders the current snapshot', async () => {
    const store = createStore(1);
    const view = await render(<Probe store={store} />);

    expect(view.getByText('value 1')).toBeTruthy();
  });

  test('re-renders when the store notifies', async () => {
    const store = createStore(1);
    const view = await render(<Probe store={store} />);

    await act(async () => {
      store.set(7);
    });

    expect(view.getByText('value 7')).toBeTruthy();
  });

  test('catches an update made before the subscription was live', async () => {
    const store = createStore(1, true);
    const view = await render(<Probe store={store} />);

    expect(view.getByText('value 2')).toBeTruthy();
  });

  test('stops listening once unmounted', async () => {
    const store = createStore(1);
    const view = await render(<Probe store={store} />);

    view.unmount();

    expect(() => store.set(9)).not.toThrow();
  });
});
