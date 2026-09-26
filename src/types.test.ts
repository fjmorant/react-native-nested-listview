import { INode, IRenderedNode } from './index';

/**
 * These assertions are checked by `yarn type-check`, not at runtime. A failure
 * is a compile error in this file rather than a failing expectation, which is
 * the point: the shapes are part of the published API.
 */
export type Expect<T extends true> = T;
export type Equals<A, B> =
  (<G>() => G extends A ? 1 : 2) extends <G>() => G extends B ? 1 : 2
    ? true
    : false;

// The shape a caller actually writes. This is what #492 was about: requiring
// `_internalId` meant the exported type could not describe the input, even
// though `_internalId` is assigned by the list and unknowable to the caller.
const data: INode[] = [
  { title: 'Node 1', items: [{ title: 'Node 1.1' }] },
  { title: 'Node 2', opened: true },
  { title: 'Node 3', hidden: true },
];

// A caller is not asked for the fields the list fills in.
export type InputOpenedIsOptional = Expect<
  Equals<INode['opened'], boolean | undefined>
>;
export type InputHiddenIsOptional = Expect<
  Equals<INode['hidden'], boolean | undefined>
>;

// ...but on the node handed to `renderNode`, both are always there.
export type RenderedIdIsString = Expect<
  Equals<IRenderedNode['_internalId'], string>
>;
export type RenderedOpenedIsBoolean = Expect<
  Equals<IRenderedNode['opened'], boolean>
>;

// A rendered node is still an input node, so it can be fed back into `data`.
const rendered: IRenderedNode = {
  _internalId: '0',
  opened: false,
  title: 'Node 1',
};
const roundTripped: INode = rendered;

describe('exported node types', () => {
  test('input data needs none of the fields the list assigns', () => {
    expect(data).toHaveLength(3);
    expect(data[1].opened).toBe(true);
  });

  test('a rendered node can be used where an input node is expected', () => {
    expect(roundTripped.title).toBe('Node 1');
    expect(roundTripped.opened).toBe(false);
  });
});
