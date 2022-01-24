import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface PagenationDotProps<T> {
  list: T[] | undefined;
  foucsItemIndex: number;
  style: ViewStyle | ViewStyle[];
}

function dotColor(index: number, focusItemIndex: number) {
  return index === focusItemIndex ? styles.colorDot : styles.whiteDot;
}

export const PagenationDot = <T extends unknown>({
  list,
  foucsItemIndex,
  style,
}: PagenationDotProps<T>) => {
  if (!list) return null;
  return (
    <View style={style}>
      <View style={styles.dotWrapper}>
        {list.map((_, index) => {
          return <View key={index} style={[styles.dot, dotColor(index, foucsItemIndex)]} />;
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
