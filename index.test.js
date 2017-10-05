import renderer from 'react-test-renderer'
import NestedListView from './index.js'
import React from 'react'
import {View, Text} from 'react-native'

jest.mock('shortid', () => ({
  generate: () => '1',
}))

const renderNode = node => (
  <View>
    <Text>node.name</Text>
  </View>
)

describe('NestedListView', () => {
  test('renders without getChildrenName', () => {
    const nestedListView = renderer.create(<NestedListView />).toJSON()
    expect(nestedListView).toMatchSnapshot()
  })

  test('renders without renderNode', () => {
    const nestedListView = renderer
      .create(<NestedListView getChildrenName={() => 'items'} />)
      .toJSON()
    expect(nestedListView).toMatchSnapshot()
  })

  test('renders without data', () => {
    const nestedListView = renderer
      .create(
        <NestedListView
          getChildrenName={() => 'items'}
          renderNode={node => node.name}
        />
      )
      .toJSON()
    expect(nestedListView).toMatchSnapshot()
  })

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
          getChildrenName={node => {
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
          getChildrenName={node => {
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
})
