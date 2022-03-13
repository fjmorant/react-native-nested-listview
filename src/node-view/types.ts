export interface INode {
  _internalId: string;
  hidden: boolean;
  opened: boolean;
  [key: string]: any;
}
