/**
 * A node as it appears in `data`.
 *
 * Callers supply their own shape, so every property here is optional and the
 * list requires none of them: `opened` sets a node's initial expanded state,
 * `hidden` suppresses the node's own row while still showing its children, and
 * children live under whatever key `getChildrenName` returns.
 *
 * This is also what `getChildrenName` and `keyExtractor` are handed, because
 * both are called while the tree is being walked, before the list has assigned
 * anything to a node.
 */
export interface Node {
  opened?: boolean;
  hidden?: boolean;
  [key: string]: any;
}

/**
 * A node as handed to `renderNode` and `onNodePressed`.
 *
 * The list assigns `_internalId` and resolves `opened` to the node's current
 * expanded state, so unlike on an input node neither is ever absent here.
 */
export interface RenderedNode extends Node {
  _internalId: string;
  opened: boolean;
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
  node: RenderedNode;
  /** Nesting depth. Nodes of `data` itself are at level 1. */
  level: number;
  /** True when the node has no children to expand into. */
  isLastLevel: boolean;
  /** True when the node's children are currently shown. */
  isExpanded: boolean;
}
