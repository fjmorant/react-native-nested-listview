/* @flow */

import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import NestedListView from './nestedListView'

const styles = StyleSheet.create({})

const generateXNumItems = (numItems, prefix) => {
  const items = []

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
    items: generateXNumItems(100, 'Item level 1.1')    
  },
  {
    name: 'Item level 1.2',
    items: [
      {
        name: 'Item level 1.2.1',
      },
      {
        name: 'Item level 1.2.2',
        children: generateXNumItems(2, 'Item level 1.2.2')
      },
    ],
  },
  {
    name: 'Item level 1.3',
    items: generateXNumItems(1000, 'Item level 1.3'),
  },
]

const colorLevels = {
  0: 'white',
  1: 'blue',  
  2: 'green',  
  3: 'red',    
}

export default class ExampleApp extends React.Component {
  nestedListView: any

  renderNode = (node: Object, level: string) => {
    const paddingLeft = (level + 1) * 30
    const backgroundColor = colorLevels[level] || 'white'

    return (
      <View style={{flex: 1, padding: 10, paddingLeft, borderWidth: 1, borderColor: 'rgb(0, 0, 0)', backgroundColor}}>
        <Text>{node.name}</Text>
      </View>
    )
  }

  onNodePressed = (node: any) => {
    // alert(JSON.stringify(node))
  }

  getChildrenName = (node: Object) => {
    if(node.name === 'Item level 1.2.2') {
      return 'children'
    }

    return 'items'
  }

  render = () => {
    return (
      <View style={{flex: 1, backgroundColor: 'rgb(255, 255, 255)', padding: 10}}>
        <NestedListView
          data={data}
          getChildrenName={this.getChildrenName}
          onNodePressed={this.onNodePressed}
          ref={ref => {
            this.nestedListView = ref
          }}
          renderNode={this.renderNode}
          style={{padding: 10}}
        />
      </View>
    )
  }
}
