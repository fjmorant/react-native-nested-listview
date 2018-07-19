import React, {Component} from 'react'
import {AppRegistry} from 'react-native'
import CustomNodeExample from './CustomNodeExample'
import StateChangeNodeExample from './StateChangeNodeExample'
import ErrorMessageExample from './ErrorMessageExample'
import NestedRowExample from './NestedRowExample'
import DynamicContentExample from './DynamicContentExample'
import ChildrenAsObjectExample from './ChildrenAsObjectExample'
import ExtraDataExample from './ExtraDataExample'

import HomeScreen from './HomeScreen'

import {StackNavigator} from 'react-navigation'

const SimpleApp = StackNavigator({
  Home: {screen: HomeScreen},
  CustomNodeExample: {screen: CustomNodeExample},
  StateChangeNodeExample: {screen: StateChangeNodeExample},
  ErrorMessageExample: {screen: ErrorMessageExample},
  NestedRowExample: {screen: NestedRowExample},
  ExtraDataExample: {screen: ExtraDataExample},
  DynamicContentExample: {screen: DynamicContentExample},
  ChildrenAsObjectExample: {screen: ChildrenAsObjectExample},
})

AppRegistry.registerComponent('example', () => SimpleApp)
