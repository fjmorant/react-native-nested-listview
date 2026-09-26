import { FlattenTreeOptions, TOP_LEVEL, flattenTree } from './flatten';

type IsExpanded = FlattenTreeOptions['isExpanded'];

const allExpanded: IsExpanded = () => true;
const fromData: IsExpanded = (_id, node) => !!node.opened;

const titles = (data: unknown, isExpanded: IsExpanded = allExpanded) =>
  flattenTree({ data, isExpanded }).rows.map((row) => row.node.title);

describe('flattenTree', () => {
  test('emits one row per node, in screen order', () => {
    const data = [
      { title: 'a', items: [{ title: 'a1' }, { title: 'a2' }] },
      { title: 'b' },
    ];

    expect(titles(data)).toEqual(['a', 'a1', 'a2', 'b']);
  });

  test('does not descend into a collapsed node', () => {
    const data = [
      { title: 'a', items: [{ title: 'a1', items: [{ title: 'a1i' }] }] },
    ];

    expect(titles(data, fromData)).toEqual(['a']);
  });

  test('descends only as far as the data opens', () => {
    const data = [
      {
        title: 'a',
        opened: true,
        items: [{ title: 'a1', items: [{ title: 'a1i' }] }],
      },
    ];

    expect(titles(data, fromData)).toEqual(['a', 'a1']);
  });

  test('puts the nodes of data at level 1 and their children one deeper', () => {
    const data = [{ title: 'a', items: [{ title: 'a1' }] }];
    const { rows } = flattenTree({ data, isExpanded: allExpanded });

    expect(TOP_LEVEL).toBe(1);
    expect(rows.map((row) => row.level)).toEqual([1, 2]);
  });

  test('marks only childless nodes as the last level', () => {
    const data = [{ title: 'a', items: [{ title: 'a1' }] }, { title: 'b' }];
    const { rows } = flattenTree({ data, isExpanded: allExpanded });

    expect(rows.map((row) => [row.node.title, row.isLastLevel])).toEqual([
      ['a', false],
      ['a1', true],
      ['b', true],
    ]);
  });

  test('treats an empty children array as the last level', () => {
    const { rows } = flattenTree({
      data: [{ title: 'a', items: [] }],
      isExpanded: allExpanded,
    });

    expect(rows[0].isLastLevel).toBe(true);
  });

  test('reads children from the name getChildrenName returns', () => {
    const data = [
      {
        title: 'a',
        descendants: [{ title: 'a1' }],
        items: [{ title: 'nope' }],
      },
    ];

    expect(
      flattenTree({
        data,
        getChildrenName: () => 'descendants',
        isExpanded: allExpanded,
      }).rows.map((row) => row.node.title),
    ).toEqual(['a', 'a1']);
  });

  test('accepts children given as an object rather than an array', () => {
    const data = [
      {
        title: 'a',
        items: { first: { title: 'a1' }, second: { title: 'a2' } },
      },
    ];

    expect(titles(data)).toEqual(['a', 'a1', 'a2']);
  });

  test('hands renderNode object children as an array', () => {
    const { rows } = flattenTree({
      data: [{ title: 'a', items: { first: { title: 'a1' } } }],
      isExpanded: allExpanded,
    });

    expect(Array.isArray(rows[0].node.items)).toBe(true);
    expect(rows[0].node.items).toHaveLength(1);
  });

  test('leaves array children untouched, without copying them', () => {
    const children = [{ title: 'a1' }];
    const { rows } = flattenTree({
      data: [{ title: 'a', items: children }],
      isExpanded: allExpanded,
    });

    expect(rows[0].node.items).toBe(children);
  });

  test('gives identical siblings distinct ids', () => {
    // Ids used to be a hash of a node's content, so two nodes holding the same
    // content shared an id, and with it one expansion state and one React key.
    const same = { title: 'same' };
    const { rows } = flattenTree({
      data: [{ ...same }, { ...same }, { ...same }],
      isExpanded: allExpanded,
    });

    expect(new Set(rows.map((row) => row.id)).size).toBe(3);
  });

  test('gives every node in the tree a distinct id', () => {
    const data = [
      { title: 'a', items: [{ title: 'x' }, { title: 'x' }] },
      { title: 'b', items: [{ title: 'x' }, { title: 'x' }] },
    ];
    const { rows, ids } = flattenTree({ data, isExpanded: allExpanded });

    expect(ids.size).toBe(rows.length);
    expect(ids.size).toBe(6);
  });

  test('hands back the same row object when a node has not changed', () => {
    const data = [
      { title: 'a', id: 'a', items: [{ title: 'a1', id: 'a1' }] },
      { title: 'b', id: 'b' },
    ];
    const first = flattenTree({ data, isExpanded: allExpanded });
    const second = flattenTree({
      data,
      isExpanded: allExpanded,
      previous: first.byId,
    });

    expect(second.rows[0]).toBe(first.rows[0]);
    expect(second.rows[1]).toBe(first.rows[1]);
    expect(second.rows[2]).toBe(first.rows[2]);
  });

  test('builds a fresh row when a node changes expanded state', () => {
    const data = [{ title: 'a', id: 'a', items: [{ title: 'a1' }] }];
    const first = flattenTree({ data, isExpanded: () => false });
    const second = flattenTree({
      data,
      isExpanded: allExpanded,
      previous: first.byId,
    });

    expect(second.rows[0]).not.toBe(first.rows[0]);
    expect(second.rows[0].isExpanded).toBe(true);
  });

  test('builds a fresh row when the node itself is replaced', () => {
    const first = flattenTree({
      data: [{ title: 'a', id: 'a' }],
      isExpanded: allExpanded,
    });
    const second = flattenTree({
      data: [{ title: 'renamed', id: 'a' }],
      isExpanded: allExpanded,
      previous: first.byId,
    });

    expect(second.rows[0]).not.toBe(first.rows[0]);
    expect(second.rows[0].node.title).toBe('renamed');
  });

  test("prefers a node's own id, then its key, over its position", () => {
    const data = [
      { title: 'a', id: 'has-id' },
      { title: 'b', key: 'has-key' },
      { title: 'c' },
    ];
    const { rows } = flattenTree({ data, isExpanded: allExpanded });

    expect(rows.map((row) => row.id)).toEqual(['has-id', 'has-key', '2']);
  });

  test('builds ids as a path, so they survive a sibling moving', () => {
    const data = [
      { title: 'a', id: 'a', items: [{ title: 'a1', id: 'one' }] },
      { title: 'b', id: 'b', items: [{ title: 'b1', id: 'one' }] },
    ];
    const { rows } = flattenTree({ data, isExpanded: allExpanded });

    expect(rows.map((row) => row.id)).toEqual(['a', 'a/one', 'b', 'b/one']);
  });

  test('lets keyExtractor decide identity', () => {
    const data = [{ title: 'a' }, { title: 'b' }];
    const { rows } = flattenTree({
      data,
      keyExtractor: (node) => `t-${node.title}`,
      isExpanded: allExpanded,
    });

    expect(rows.map((row) => row.id)).toEqual(['t-a', 't-b']);
  });

  test('falls back to position when keyExtractor returns nothing', () => {
    const { rows } = flattenTree({
      data: [{ title: 'a' }, { title: 'b' }],
      keyExtractor: () => undefined,
      isExpanded: allExpanded,
    });

    expect(rows.map((row) => row.id)).toEqual(['0', '1']);
  });

  test('separates siblings that claim the same key', () => {
    const { rows } = flattenTree({
      data: [
        { title: 'a', id: 'dupe' },
        { title: 'b', id: 'dupe' },
      ],
      isExpanded: allExpanded,
    });

    expect(rows.map((row) => row.id)).toEqual(['dupe', 'dupe:1']);
    expect(new Set(rows.map((row) => row.id)).size).toBe(2);
  });

  test('gives the node passed to renderNode the id and expanded state', () => {
    const { rows } = flattenTree({
      data: [{ title: 'a', opened: true, items: [{ title: 'a1' }] }],
      isExpanded: fromData,
    });

    expect(rows[0].node._internalId).toBe(rows[0].id);
    expect(rows[0].node.opened).toBe(true);
    expect(rows[1].node.opened).toBe(false);
  });

  test('reports a collapsed node as not opened, so a chevron can follow it', () => {
    const data = [{ title: 'a', items: [{ title: 'a1' }] }];

    expect(
      flattenTree({ data, isExpanded: fromData }).rows[0].node.opened,
    ).toBe(false);
    expect(flattenTree({ data, isExpanded: fromData }).rows[0].isExpanded).toBe(
      false,
    );
  });

  test('a hidden node contributes its children but no row of its own', () => {
    const data = [
      { title: 'hidden', hidden: true, opened: true, items: [{ title: 'a1' }] },
      { title: 'b' },
    ];
    const { rows } = flattenTree({ data, isExpanded: fromData });

    expect(rows.map((row) => row.node.title)).toEqual(['a1', 'b']);
    expect(rows[0].level).toBe(2);
  });

  test('never mutates the data it is given', () => {
    const data = [{ title: 'a', items: [{ title: 'a1' }] }];
    const before = JSON.stringify(data);

    flattenTree({ data, isExpanded: allExpanded });

    expect(JSON.stringify(data)).toBe(before);
    expect(data[0]).not.toHaveProperty('_internalId');
  });

  test('treats children that are not a collection as no children', () => {
    const { rows } = flattenTree({
      data: [{ title: 'a', items: 'not a collection' }],
      isExpanded: allExpanded,
    });

    expect(rows).toHaveLength(1);
    expect(rows[0].isLastLevel).toBe(true);
  });

  test('skips entries that are not nodes', () => {
    const data = [null, undefined, 'text', 7, { title: 'a' }];

    expect(titles(data)).toEqual(['a']);
  });

  test('returns nothing for data that is absent', () => {
    expect(flattenTree({ data: null, isExpanded: allExpanded }).rows).toEqual(
      [],
    );
    expect(
      flattenTree({ data: undefined, isExpanded: allExpanded }).rows,
    ).toEqual([]);
    expect(flattenTree({ data: [], isExpanded: allExpanded }).rows).toEqual([]);
  });

  test('walks a tree far deeper than the call stack allows', () => {
    // Traversal is iterative for this reason: recursion would overflow here,
    // and so would a list-per-level.
    const depth = 50000;
    const root: any = { title: 'n0', items: [] };
    let cursor = root;

    for (let level = 1; level < depth; level++) {
      const child = { title: `n${level}`, items: [] as unknown[] };
      cursor.items.push(child);
      cursor = child;
    }

    const { rows } = flattenTree({ data: [root], isExpanded: allExpanded });

    expect(rows).toHaveLength(depth);
    expect(rows[depth - 1].level).toBe(depth);
    expect(rows[depth - 1].isLastLevel).toBe(true);
  });
});
