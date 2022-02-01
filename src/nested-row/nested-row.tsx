import React, { useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

const styles = StyleSheet.create({
  nestedRow: {
    flex: 1,
    justifyContent: 'center',
  },
});

export interface IProps {
  height?: number;
  level?: number;
  paddingLeftIncrement?: number;
  style?: StyleProp<ViewStyle>;
}

const NestedRow: React.FC<IProps> = React.memo(
  ({ height, children, level = 0, paddingLeftIncrement = 10, style }) => {
    const composedStyles = useMemo(
      () => [
        styles.nestedRow,
        style,
        {
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
