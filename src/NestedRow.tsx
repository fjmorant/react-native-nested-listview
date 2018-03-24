/* @flow */

import * as React from 'react'
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
  style?: any
}

export default class NestedRow extends React.PureComponent<IProps> {
  public render() {
    const {height = 50, children, level = 0, style} = this.props

    return (
      <View
        style={[
          styles.nestedRow,
          {
            ...style,
            height,
            paddingLeft: level * 10,
          },
        ]}>
        {children}
      </View>
    )
  }
}
