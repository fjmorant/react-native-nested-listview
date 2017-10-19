import React, {Component} from 'react'
import {AppRegistry} from 'react-native'
import CustomNodeExample from './CustomNodeExample'
import StateChangeNodeExample from './StateChangeNodeExample'
import ErrorMessageExample from './ErrorMessageExample'
import NestedRowExample from './NestedRowExample'

import HomeScreen from './HomeScreen'

import {StackNavigator} from 'react-navigation'

const SimpleApp = StackNavigator({
  Home: {screen: HomeScreen},
  CustomNodeExample: {screen: CustomNodeExample},
  StateChangeNodeExample: {screen: StateChangeNodeExample},
  ErrorMessageExample: {screen: ErrorMessageExample},
  NestedRowExample: {screen: NestedRowExample},
})

AppRegistry.registerComponent('example', () => SimpleApp)
