/* @flow */

import React from 'react'
import {
  Alert,
  StyleSheet,
  Text,
  View,
  type Props,
  type State,
  Button,
} from 'react-native'
import NestedListView from 'react-native-nested-listview'

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
    name: 'Books Genders',
    descendants: [
      {
        name: 'Adventure',
      },
      {
        name: 'Romance',
      },
    ],
  },
  {
    name: 'Movies',
    descendants: [
      {
        name: 'Drama',
      },
      {
        name: 'Action',
      },
    ],
  },
  {
    name: 'Technology',
    descendants: [
      {name: 'Phones', descendants: [{name: 'Samsung'}, {name: 'iPhone'}]},
    ],
  },
]

const data2 = [
  {
    name: 'Music',
    descendants: [
      {
        name: 'Rock',
      },
      {
        name: 'Heavy Metal',
      },
      {
        name: 'Pop',
      },
    ],
  },
  {
    name: 'Food',
    descendants: [
      {
        name: 'Dairy',
      },
      {
        name: 'Sweet',
        descendants: [
          {
            name: 'Chocolat',
          },
          {
            name: 'Sugar',
          },
          {
            name: 'Biscuits',
          },
        ],
      },
    ],
  },
  {
    name: 'Technology',
    descendants: [{name: 'Laptop', descendants: [{name: 'Pc', name: 'Mac'}]}],
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

  state = {
    dataSource: 'data',
  }

  renderNode = (node: Object, level: number) => {
    const paddingLeft = (level + 1) * 30

    return (
      <View style={[styles.node, {backgroundColor: 'white', paddingLeft}]}>
        <Text>{node.name}</Text>
      </View>
    )
  }

  getChildrenName = (node: Object) => {
    return 'descendants'
  }
  onPressUpdate = () => {
    if (this.state.dataSource === 'data') {
      this.setState({
        dataSource: 'data2',
      })
    } else {
      this.setState({
        dataSource: 'data',
      })
    }
  }

  render = () => {
    return (
      <View style={styles.container}>
        <View style={{margin: 10}}>
          <Button onPress={this.onPressUpdate} title="Update Content" />
        </View>
        <NestedListView
          data={this.state.dataSource === 'data' ? data : data2}
          getChildrenName={this.getChildrenName}
          onNodePressed={this.onNodePressed}
          renderNode={this.renderNode}
        />
      </View>
    )
  }
}
