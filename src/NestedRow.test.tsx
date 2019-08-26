import * as React from 'react'
import {Text} from 'react-native'
// tslint:disable-next-line:no-implicit-dependencies
import * as renderer from 'react-test-renderer'
import NestedRow from './NestedRow'

describe('NestedListView', () => {
    test('renders with simple array', () => {
        const nestedListView = renderer
            .create(
                <NestedRow
                    level={1}
                    style={{borderColor: 'black', borderWidth: 1}}
                >
                    <Text>Test</Text>
                </NestedRow>
            )
            .toJSON()
        expect(nestedListView).toMatchSnapshot()
    })

    test('renders with simple array without level', () => {
        const nestedListView = renderer
            .create(
                <NestedRow style={{borderColor: 'black', borderWidth: 1}}>
                    <Text>Test</Text>
                </NestedRow>
            )
            .toJSON()
        expect(nestedListView).toMatchSnapshot()
    })

    test('renders customised', () => {
        const nestedListView = renderer
            .create(
                <NestedRow
                    level={1}
                    height={60}
                    paddingLeftIncrement={15}
                    style={{borderColor: 'black', borderWidth: 1}}
                >
                    <Text>Test</Text>
                </NestedRow>
            )
            .toJSON()
        expect(nestedListView).toMatchSnapshot()
    })
})
