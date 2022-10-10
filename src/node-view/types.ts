export interface Node {
  _internalId: string;
  hidden: boolean;
  opened: boolean;
  [key: string]: any;
}
