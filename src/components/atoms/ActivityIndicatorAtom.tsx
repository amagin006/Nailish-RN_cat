import React from 'react';
import { View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { AppGeneralColor } from '~/styles/ColorStyle';

interface ActivityIndicatorAtomProps {
  containerStyle?: ViewStyle | ViewStyle[];
  animating?: boolean;
  color?: string;
  hidesWhenStopped?: boolean;
  onLayout?: (event) => void;
  size?: 'small' | 'large';
  style?: ViewStyle | ViewStyle[];
}

export const ActivityIndicatorAtom: React.FC<ActivityIndicatorAtomProps> = ({
  containerStyle,
  animating,
  color,
  hidesWhenStopped,
  onLayout,
  size,
  style,
}) => {
  return (
    <View style={[styles.defaultContainer, containerStyle]}>
      <ActivityIndicator
        color={color ?? AppGeneralColor.Indicator.Primary}
        animating={animating}
        hidesWhenStopped={hidesWhenStopped}
        onLayout={onLayout}
        size={size || 'large'}
        style={style}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  defaultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
