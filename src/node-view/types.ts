import { Store } from 'use-global-hook';

export interface INode {
  _internalId: string;
  hidden: boolean;
  opened: boolean;
  [key: string]: any;
}

export interface GlobalState {
  nodesState: { root: boolean };
}

export interface NodeActions {
  setOpenedNode: (
    store: Store<GlobalState, NodeActions>,
    { internalId, opened }: any,
  ) => void;
}
