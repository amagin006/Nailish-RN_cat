import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface PagenationDotProps {
  list: any[];
  foucsItemIndex: number;
  style: ViewStyle | ViewStyle[];
}

export const PagenationDot: React.FC<PagenationDotProps> = ({ list, foucsItemIndex, style }) => {
  function dotColor(index) {
    return index === foucsItemIndex ? styles.colorDot : styles.whiteDot;
  }
  return (
    <View style={style}>
      <View style={styles.dotWrapper}>
        {list.map((listItem, index) => {
          return <View key={index} style={[styles.dot, dotColor(index)]} />;
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dotWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    marginHorizontal: 3,
  },
  colorDot: {
    backgroundColor: '#6BA3EF',
  },
  whiteDot: {
    backgroundColor: '#E2E2E2',
  },
});

export default PagenationDot;
