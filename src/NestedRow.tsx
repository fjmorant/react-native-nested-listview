/* @flow */

import * as React from 'react'
import isEqual from 'react-fast-compare'
import {StyleSheet, View} from 'react-native'

const styles = StyleSheet.create({
    nestedRow: {
        flex: 1,
        justifyContent: 'center',
    },
})

export interface IProps {
    height?: number
    children: any
    level?: number
    paddingLeftIncrement?: number
    style?: any
}

const NestedRow = React.memo(
    ({
        height = 50,
        children,
        level = 0,
        paddingLeftIncrement = 10,
        style,
    }: IProps) => (
        <View
            style={[
                styles.nestedRow,
                {
                    ...style,
                    height,
                    paddingLeft: level * paddingLeftIncrement,
                },
            ]}
        >
            {children}
        </View>
    ),
    isEqual
)

export default NestedRow
