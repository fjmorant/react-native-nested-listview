/**
 * A node of the tree passed in `data`.
 *
 * Callers supply their own shape; the properties named here are the ones the
 * list itself reads. `_internalId` is assigned by the list rather than by the
 * caller, and `opened` reflects the node's current expanded state on the node
 * handed to `renderNode`.
 */
export interface Node {
  _internalId: string;
  hidden: boolean;
  opened: boolean;
  [key: string]: any;
}

/**
 * One row of the flattened tree.
 *
 * `flattenTree` emits these in screen order, so a tree of any depth renders as
 * a single flat list rather than a list per level.
 */
export interface Row {
  /** Stable identity of the node within the tree. */
  id: string;
  /** The node exactly as it appeared in `data`. */
  source: Node;
  /** The node handed to `renderNode`. */
  node: Node;
  /** Nesting depth. Nodes of `data` itself are at level 1. */
  level: number;
  /** True when the node has no children to expand into. */
  isLastLevel: boolean;
  /** True when the node's children are currently shown. */
  isExpanded: boolean;
}
