/* @flow */

import React from 'react'
import {
  Alert,
  StyleSheet,
  Text,
  View,
  type Props,
  type State,
} from 'react-native'
import NestedListView, {type Node} from 'react-native-nested-listview'

class NestedRow extends React.PureComponent<Props, State> {
  render() {
    const {height = 50, children, level, style} = this.props

    return (
      <View
        style={{
          ...style,
          justifyContent: 'center',
          height,
          paddingLeft: level * 10,
        }}
        pointerEvents="none"
      >
        {children}
      </View>
    )
  }
}

const generateXNumItems = (numItems, prefix) => {
  const items = []

  let i

  for (i = 0; i < numItems; i++) {
    items.push({
      name: `${prefix}.${i}`,
    })
  }

  return items
}

const data = [
  {
    name: 'Item level 1.1',
    descendants: generateXNumItems(2, 'Item level 1.1'),
  },
  {
    name: 'Item level 1.2',
    descendants: [
      {
        name: 'Item level 1.2.1',
      },
      {
        name: 'Item level 1.2.2',
        children: generateXNumItems(3, 'Item level 1.2.2'),
      },
    ],
  },
  {
    name: 'Item level 1.3',
    descendants: generateXNumItems(4, 'Item level 1.3'),
  },
]

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'rgb(255, 255, 255)', padding: 15},
  node: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgb(0, 0, 0)',
  },
})
export default class ExampleApp extends React.Component<Props, State> {
  nestedListView: any

  getChildrenName = (node: Node) => {
    if (node.name === 'Item level 1.2.2') {
      return 'children'
    }

    return 'descendants'
  }

  render = () => {
    return (
      <View style={styles.container}>
        <NestedListView
          data={data}
          getChildrenName={this.getChildrenName}
          renderNode={(node: Node, level: number) => (
            <NestedRow
              level={level}
              style={{borderColor: 'black', borderWidth: 1}}
            >
              <Text>{node.name}</Text>
            </NestedRow>
          )}
        />
      </View>
    )
  }
}
