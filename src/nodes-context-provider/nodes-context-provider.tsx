import React, { useContext, useRef } from 'react';

type SetOpenedNodesParams = {
  internalId: string;
  opened: boolean;
};

type NodeContext = {
  openedNodes: { [name: string]: boolean };
  setOpenNode?: ({ internalId, opened }: SetOpenedNodesParams) => void;
};

const defaultContextValue = {
  openedNodes: {},
  setOpenNode: undefined,
};

const NodesContext = React.createContext<NodeContext>(defaultContextValue);

export const useNodesContext = () => useContext(NodesContext);

const NodeProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const nodesOpenedRef = useRef({ root: true });

  const setOpenNode = ({ internalId, opened }: SetOpenedNodesParams) => {
    nodesOpenedRef.current = {
      ...nodesOpenedRef.current,
      [internalId]: opened,
    };
  };

  return (
    <NodesContext.Provider
      value={{ openedNodes: nodesOpenedRef.current, setOpenNode }}>
      {children}
    </NodesContext.Provider>
  );
};

export { NodeProvider };
