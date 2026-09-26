import React from 'react';
import { DEFAULT_CHILDREN_NAME } from '../flatten';
import { Node, Row } from '../types';
import { createExpansionStore } from './expansion-store';
import { useSyncExternalStore } from './use-sync-external-store';

export interface UseFlattenedRowsOptions {
  data: unknown;
  extraData?: unknown;
  getChildrenName?: (node: Node) => string;
  keyExtractor?: (node: Node, index: number) => string | number;
  keepOpenedState?: boolean;
}

export interface UseFlattenedRowsResult {
  rows: Row[];
  toggle: (row: Row) => void;
}

/**
 * The visible rows of `data`, and the toggle that changes them.
 */
export const useFlattenedRows = ({
  data,
  extraData,
  getChildrenName,
  keyExtractor,
  keepOpenedState,
}: UseFlattenedRowsOptions): UseFlattenedRowsResult => {
  const [store] = React.useState(createExpansionStore);

  // Both callbacks are read through a ref. They are almost always inline
  // arrows, so depending on their identity would re-flatten the whole tree on
  // every render of the parent — which is what the previous implementation did,
  // and the cost this rewrite exists to remove.
  const callbacks = React.useRef({ getChildrenName, keyExtractor });

  callbacks.current.getChildrenName = getChildrenName;
  callbacks.current.keyExtractor = keyExtractor;

  const resolveChildrenName = React.useCallback((node: Node) => {
    const resolve = callbacks.current.getChildrenName;

    return resolve ? resolve(node) : DEFAULT_CHILDREN_NAME;
  }, []);

  const resolveKey = React.useCallback((node: Node, index: number) => {
    const resolve = callbacks.current.keyExtractor;

    return resolve ? resolve(node, index) : undefined;
  }, []);

  // Derived during render rather than in an effect, so the first paint already
  // has its rows. The store is mutated but not notified, and the rebuild is
  // pure given the same source, so running twice under StrictMode is harmless.
  React.useMemo(() => {
    store.setSource({
      data,
      extraData,
      getChildrenName: resolveChildrenName,
      keyExtractor: resolveKey,
      keepOpenedState,
    });
  }, [
    store,
    data,
    extraData,
    keepOpenedState,
    resolveChildrenName,
    resolveKey,
  ]);

  const rows = useSyncExternalStore(store.subscribe, store.getRows);

  return { rows, toggle: store.toggle };
};
