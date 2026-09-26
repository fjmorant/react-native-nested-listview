import React from 'react';

type Subscribe = (onStoreChange: () => void) => () => void;

type UseSyncExternalStore = <T>(
  subscribe: Subscribe,
  getSnapshot: () => T,
) => T;

/**
 * Stand-in for React 17, which has no `useSyncExternalStore`.
 *
 * Exported so it can be tested directly: on React 18 and later the export below
 * resolves to React's own hook, and this would otherwise never run.
 *
 * Reading during render and subscribing in an effect leaves a window in which
 * an update would be missed, so the snapshot is re-checked once the
 * subscription is live.
 */
export const useSyncExternalStoreFallback = <T>(
  subscribe: Subscribe,
  getSnapshot: () => T,
): T => {
  const [, forceRender] = React.useReducer((count: number) => count + 1, 0);
  const snapshot = getSnapshot();
  const rendered = React.useRef(snapshot);

  rendered.current = snapshot;

  React.useEffect(() => {
    const unsubscribe = subscribe(forceRender);

    if (getSnapshot() !== rendered.current) {
      forceRender();
    }

    return unsubscribe;
  }, [subscribe, getSnapshot, forceRender]);

  return snapshot;
};

const fromReact = (
  React as unknown as { useSyncExternalStore?: UseSyncExternalStore }
).useSyncExternalStore;

/**
 * The package declares `react: >=17` and the hook arrived in React 18, so which
 * implementation is used is decided once at module load. Hook order therefore
 * never varies within a running app.
 */
export const useSyncExternalStore: UseSyncExternalStore =
  fromReact ?? useSyncExternalStoreFallback;
