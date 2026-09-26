import { flattenTree } from '../flatten';
import { Node, Row } from '../types';

type Listener = () => void;

export interface ExpansionSource {
  data: unknown;
  /**
   * Not read when flattening. It is here so that changing it changes the source
   * and therefore rebuilds the rows, which is what `extraData` is documented to
   * do.
   */
  extraData?: unknown;
  getChildrenName?: (node: Node) => string;
  keyExtractor?: (node: Node, index: number) => string | number | undefined;
  keepOpenedState?: boolean;
}

export interface ExpansionStore {
  /**
   * The current rows. The same array is returned until something changes, so it
   * is safe as a `useSyncExternalStore` snapshot.
   */
  getRows: () => Row[];
  subscribe: (listener: Listener) => () => void;
  /** Replace the tree being flattened. Rebuilds without notifying. */
  setSource: (source: ExpansionSource) => void;
  /** Flip a row's expanded state, rebuild, and notify. */
  toggle: (row: Row) => void;
}

/**
 * Expansion state, and the rows derived from it.
 *
 * Both live outside React state, in the spirit of Legend List's signal store:
 * expansion is a plain `Map`, a toggle rebuilds the row array once and notifies
 * subscribers, and `toggle` never changes identity — so a row that did not move
 * does not re-render because a sibling was expanded.
 *
 * State is keyed by node id rather than held per mounted component, which is
 * what allows a node to keep its expanded state while it is scrolled out of the
 * window and unmounted.
 */
export const createExpansionStore = (): ExpansionStore => {
  const expanded = new Map<string, boolean>();
  const listeners = new Set<Listener>();

  let source: ExpansionSource = { data: undefined };
  let rows: Row[] = [];
  let byId = new Map<string, Row>();

  // Data decides the initial state; once a node has been pressed, the press
  // decides it.
  const isExpanded = (id: string, node: Node): boolean =>
    expanded.has(id) ? !!expanded.get(id) : !!node.opened;

  const rebuild = () => {
    const result = flattenTree({
      data: source.data,
      getChildrenName: source.getChildrenName,
      keyExtractor: source.keyExtractor,
      isExpanded,
      previous: byId,
    });

    rows = result.rows;
    byId = result.byId;

    // Ids that were not reached are nodes that have left the data, or that sit
    // inside a collapsed parent. Dropping their state reproduces the recursive
    // implementation, where collapsing a node unmounted its descendants and
    // discarded the state they held; `keepOpenedState` is what made that state
    // outlive them, and still is.
    if (!source.keepOpenedState) {
      expanded.forEach((_opened, id) => {
        if (!result.ids.has(id)) {
          expanded.delete(id);
        }
      });
    }
  };

  return {
    getRows: () => rows,

    subscribe: (listener: Listener) => {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },

    setSource: (next: ExpansionSource) => {
      source = next;
      rebuild();
    },

    toggle: (row: Row) => {
      expanded.set(row.id, !row.isExpanded);
      rebuild();
      listeners.forEach((listener) => listener());
    },
  };
};
