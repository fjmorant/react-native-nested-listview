import React, { useContext, useRef } from 'react';

type SetOpenedNodesParams = {
  internalId: string;
  opened: boolean;
};

type INodexContext = {
  openedNodes: { [name: string]: boolean };
  setOpenNode: ({ internalId, opened }: SetOpenedNodesParams) => void;
};

const NodesContext = React.createContext<INodexContext>({
  openedNodes: {},
  setOpenNode: (_: SetOpenedNodesParams) => {},
});

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
