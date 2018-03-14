import * as React from 'react'
import {Text, View} from 'react-native'
// tslint:disable-next-line:no-implicit-dependencies
import * as renderer from 'react-test-renderer'
import NestedListView, {NestedRow} from './index'

jest.mock('shortid', () => {
  return {
    default: {
      generate: () => '1',
    },
  }
})

const renderNode = (node: any) => (
  <View>
    <Text>{node.name}</Text>
  </View>
)

describe('NestedListView', () => {
  test('renders with simple array', () => {
    const data = [{title: 'child1'}, {title: 'child2'}, {title: 'child3'}]
    const nestedListView = renderer
      .create(
        <NestedListView
          getChildrenName={() => 'items'}
          renderNode={renderNode}
          data={data}
        />
      )
      .toJSON()
    expect(nestedListView).toMatchSnapshot()
  })

  test('renders with nested arrays', () => {
    const data = [
      {
        title: 'child1',
        items: [{name: 'subchild 1.1'}, {name: 'subchild 1.2'}],
      },
      {title: 'child2', items: [{key: 'subchild 2.1'}]},
      {title: 'child3'},
    ]
    const nestedListView = renderer
      .create(
        <NestedListView
          getChildrenName={() => 'items'}
          renderNode={renderNode}
          data={data}
        />
      )
      .toJSON()
    expect(nestedListView).toMatchSnapshot()
  })

  test('renders with nested arrays and children with different name', () => {
    const data = [
      {
        title: 'child1',
        items: [{name: 'subchild 1.1'}, {name: 'subchild 1.2'}],
      },
      {title: 'child2', descendants: [{key: 'subchild 2.1'}]},
      {title: 'child3'},
    ]
    const nestedListView = renderer
      .create(
        <NestedListView
          getChildrenName={(node: any) => {
            if (node.title === 'child2') {
              return 'descendants'
            }
            return 'items'
          }}
          renderNode={renderNode}
          data={data}
        />
      )
      .toJSON()
    expect(nestedListView).toMatchSnapshot()
  })

  test('renders with nested arrays and children with different that does not exists', () => {
    const data = [
      {
        title: 'child1',
        items: [{name: 'subchild 1.1'}, {name: 'subchild 1.2'}],
      },
      {title: 'child2', descendants: [{key: 'subchild 2.1'}]},
      {title: 'child3'},
    ]
    const nestedListView = renderer
      .create(
        <NestedListView
          getChildrenName={(node: any) => {
            if (node.title === 'child2') {
              return 'children'
            }
            return 'items'
          }}
          renderNode={renderNode}
          data={data}
        />
      )
      .toJSON()
    expect(nestedListView).toMatchSnapshot()
  })

  test('renders with onNodePressed', () => {
    const data = [{title: 'child1'}, {title: 'child2'}, {title: 'child3'}]
    const nestedListView = renderer
      .create(
        <NestedListView
          getChildrenName={() => 'items'}
          renderNode={renderNode}
          onNodePressed={() => alert('Node Pressed')}
          data={data}
        />
      )
      .toJSON()
    expect(nestedListView).toMatchSnapshot()
  })

  test('renders with NestedRow', () => {
    const data = [{title: 'child1'}, {title: 'child2'}, {title: 'child3'}]
    const nestedListView = renderer
      .create(
        <NestedListView
          getChildrenName={() => 'items'}
          renderNode={(node: any, level?: number) => (
            <NestedRow level={level}>{node.name}</NestedRow>
          )}
          data={data}
        />
      )
      .toJSON()
    expect(nestedListView).toMatchSnapshot()
  })
})
