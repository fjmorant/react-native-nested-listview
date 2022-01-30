import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  nestedRow: {
    flex: 1,
    justifyContent: 'center',
  },
});

export interface IProps {
  height?: number;
  children: any;
  level?: number;
  paddingLeftIncrement?: number;
  style?: any;
}

const NestedRow = React.memo(
  ({
    height,
    children,
    level = 0,
    paddingLeftIncrement = 10,
    style,
  }: IProps) => {
    const composedStyles = useMemo(
      () => [
        styles.nestedRow,
        {
          ...style,
          paddingLeft: level * paddingLeftIncrement,
        },
        height ? { height } : {},
      ],
      [height, level, paddingLeftIncrement, style],
    );
    return <View style={composedStyles}>{children}</View>;
  },
);

NestedRow.displayName = 'NestedRow';

export { NestedRow };
