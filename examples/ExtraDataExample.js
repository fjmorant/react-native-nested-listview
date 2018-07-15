/* @flow */

import React from 'react'
import {
  Alert,
  StyleSheet,
  Text,
  View,
  type Props,
  type State,
  TouchableOpacity,
} from 'react-native'
import NestedListView, {
  type Node,
  NestedRow,
} from 'react-native-nested-listview'

const generateXNumItems = (numItems, prefix) => {
  const items = []

  let i

  for (i = 0; i < numItems; i++) {
    items.push({
      name: `${prefix}.${i}`,
      selected: false,
    })
  }

  return items
}

const data = [
  {
    name: 'Item level 1.1',
    customId: '1.1',
    selected: false,
  },
  {
    name: 'Item level 1.2',
    selected: false,
    customId: '1.2',
    descendants: [
      {
        name: 'Item level 1.2.1',
        customId: '1.2.1',
        selected: false,
      },
      {
        name: 'Item level 1.2.2',
        customId: '1.2.2',
        selected: false,
      },
    ],
  },
  {
    name: 'Item level 1.3',
    customId: '1.3',
    selected: false,
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

  constructor(props) {
    super(props)
    this.state = {
      selected: [],
    }
  }

  getChildrenName = (node: Node) => {
    if (node.name === 'Item level 1.2.2') {
      return 'children'
    }

    return 'descendants'
  }

  toggleChecked = node => {
    if (this.state.selected.includes(node.customId)) {
      const selected = this.state.selected.filter(id => id !== node.customId)
      this.setState({
        selected,
      })
    } else {
      this.setState({
        selected: [node.customId, ...this.state.selected],
      })
    }
  }

  render = () => {
    console.log('Render NestedRowExample')
    return (
      <View style={styles.container}>
        <NestedListView
          data={data}
          extraData={this.state.selected}
          getChildrenName={this.getChildrenName}
          renderNode={(node: Node, level: number) => (
            <View>
              <Text>{node.name}</Text>
              <TouchableOpacity onPress={() => this.toggleChecked(node)}>
                {this.state.selected.includes(node.customId) ? (
                  <Text>CHECKED</Text>
                ) : (
                  <Text>NOT CHECKED</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    )
  }
}
