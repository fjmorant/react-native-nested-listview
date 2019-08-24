/* @flow */

import * as React from "react";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  nestedRow: {
    flex: 1,
    justifyContent: "center"
  }
});

export interface IProps {
  height?: number;
  children: any;
  level?: number;
  paddingLeftIncrement?: number;
  style?: any;
}

const NestedRow = ({
  height = 50,
  children,
  level = 0,
  paddingLeftIncrement = 10,
  style
}: IProps) => {
  return (
    <View
      style={[
        styles.nestedRow,
        {
          ...style,
          height,
          paddingLeft: level * paddingLeftIncrement
        }
      ]}
    >
      {children}
    </View>
  );
};

export default NestedRow;
