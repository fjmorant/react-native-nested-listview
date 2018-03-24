import * as React from 'react'
import {Text} from 'react-native'
import * as renderer from 'react-test-renderer'
import NestedRow from './NestedRow'

describe('NestedListView', () => {
  test('renders with simple array', () => {
    const nestedListView = renderer
      .create(
        <NestedRow level={1} style={{borderColor: 'black', borderWidth: 1}}>
          <Text>Test</Text>
        </NestedRow>
      )
      .toJSON()
    expect(nestedListView).toMatchSnapshot()
  })
})
