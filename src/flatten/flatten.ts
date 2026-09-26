import { Node, RenderedNode, Row } from '../types';

/**
 * Level given to the nodes of `data` itself.
 *
 * The recursive implementation this replaces wrapped `data` in a hidden root
 * node at level 0 and rendered its children one level deeper, so `renderNode`
 * has always received 1 for a top-level node. Keeping that means existing
 * `NestedRow` indentation is unchanged.
 */
export const TOP_LEVEL = 1;

export const DEFAULT_CHILDREN_NAME = 'items';

export interface FlattenTreeOptions {
  data: unknown;
  getChildrenName?: (node: Node) => string;
  /**
   * Identity of a node within its parent. Returning `undefined` falls back to
   * the node's own `id` or `key`, and then to its position.
   */
  keyExtractor?: (node: Node, index: number) => string | number | undefined;
  /** Whether a node is expanded. Called once per reachable node. */
  isExpanded: (id: string, node: Node) => boolean;
  /**
   * Rows from the previous pass. A row whose node has not changed is returned
   * as the same object, so a memoized row component can skip re-rendering.
   */
  previous?: Map<string, Row>;
}

export interface FlattenTreeResult {
  rows: Row[];
  /** Every id reached in this pass, so stale expansion state can be pruned. */
  ids: Set<string>;
  /** The rows by id, to hand back as `previous` on the next pass. */
  byId: Map<string, Row>;
}

interface Frame {
  children: unknown[];
  index: number;
  parentId: string;
  level: number;
  usedKeys: Set<string>;
}

/**
 * Children as an array.
 *
 * Children may arrive as an object keyed by name rather than as an array, which
 * the recursive implementation also accepted.
 */
const asChildrenArray = (value: unknown): unknown[] | undefined => {
  if (!value) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value !== 'object') {
    return undefined;
  }

  const record = value as Record<string, unknown>;

  return Object.keys(record).map((key) => record[key]);
};

const naturalKey = (node: Node): string | number | undefined => {
  if (typeof node.id === 'string' || typeof node.id === 'number') {
    return node.id;
  }

  if (typeof node.key === 'string' || typeof node.key === 'number') {
    return node.key;
  }

  return undefined;
};

/**
 * Identity of a node, as a path through the tree.
 *
 * This replaces hashing each node's entire subtree with `object-hash`. That was
 * O(total nodes) in both time and retained string data on every data change,
 * and because the hash was derived from content alone, two nodes holding the
 * same content shared an id — and so shared one expansion state and one React
 * key. A path is O(1) per node and unique by construction.
 */
const rowId = (
  frame: Frame,
  node: Node,
  index: number,
  keyExtractor: FlattenTreeOptions['keyExtractor'],
): string => {
  const extracted = keyExtractor ? keyExtractor(node, index) : undefined;
  const resolved = extracted != null ? extracted : naturalKey(node);

  let key = resolved != null ? String(resolved) : String(index);

  // Two siblings carrying the same key would collide into one id, and with it
  // one expansion state and one React key, so fall back to the position.
  if (frame.usedKeys.has(key)) {
    key = `${key}:${index}`;
  }

  frame.usedKeys.add(key);

  return frame.parentId === '' ? key : `${frame.parentId}/${key}`;
};

/**
 * The node handed to `renderNode`.
 *
 * Caller data is never mutated, so this is a shallow copy carrying the id the
 * list assigned and the node's current expanded state. Children are rewritten
 * only when they arrived as an object, matching what the recursive
 * implementation passed down.
 */
const project = (
  node: Node,
  id: string,
  opened: boolean,
  childrenName: string,
  children: unknown[] | undefined,
): RenderedNode => {
  const projected: RenderedNode = { ...node, _internalId: id, opened };

  if (children && node[childrenName] !== children) {
    projected[childrenName] = children;
  }

  return projected;
};

/**
 * Flatten a tree into the rows that are currently visible.
 *
 * Traversal is iterative rather than recursive: the point of the exercise is to
 * stop paying for depth, and a recursive walk would only trade a stack of
 * nested lists for a stack of nested calls. Collapsed nodes are never
 * descended into, so the work is proportional to what is on screen rather than
 * to the size of the tree.
 */
export const flattenTree = ({
  data,
  getChildrenName,
  keyExtractor,
  isExpanded,
  previous,
}: FlattenTreeOptions): FlattenTreeResult => {
  const rows: Row[] = [];
  const ids = new Set<string>();
  const byId = new Map<string, Row>();
  const roots = asChildrenArray(data);

  if (!roots) {
    return { rows, ids, byId };
  }

  const stack: Frame[] = [
    {
      children: roots,
      index: 0,
      parentId: '',
      level: TOP_LEVEL,
      usedKeys: new Set<string>(),
    },
  ];

  while (stack.length > 0) {
    const frame = stack[stack.length - 1];

    if (frame.index >= frame.children.length) {
      stack.pop();
      continue;
    }

    const index = frame.index;
    const candidate = frame.children[index];

    frame.index += 1;

    if (!candidate || typeof candidate !== 'object') {
      continue;
    }

    const node = candidate as Node;
    const id = rowId(frame, node, index, keyExtractor);

    ids.add(id);

    const childrenName = getChildrenName
      ? getChildrenName(node)
      : DEFAULT_CHILDREN_NAME;
    const children = asChildrenArray(node[childrenName]);
    const hasChildren = !!children && children.length > 0;
    const isLastLevel = !hasChildren;
    const opened = isExpanded(id, node);

    // A hidden node contributes no row of its own but still contributes its
    // children, which is how the old hidden root node behaved.
    if (!node.hidden) {
      // Expanding one node rebuilds every row, so rows that did not actually
      // change are handed back as the same object. That is what lets the
      // memoized row component re-render only the rows that appeared.
      const before = previous && previous.get(id);
      const row: Row =
        before &&
        before.source === node &&
        before.isExpanded === opened &&
        before.level === frame.level &&
        before.isLastLevel === isLastLevel
          ? before
          : {
              id,
              source: node,
              node: project(node, id, opened, childrenName, children),
              level: frame.level,
              isLastLevel,
              isExpanded: opened,
            };

      rows.push(row);
      byId.set(id, row);
    }

    if (hasChildren && opened) {
      stack.push({
        children: children as unknown[],
        index: 0,
        parentId: id,
        level: frame.level + 1,
        usedKeys: new Set<string>(),
      });
    }
  }

  return { rows, ids, byId };
};
