import React from 'react';
import { View, Text, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { AppGeneralColor } from '~/styles/ColorStyle';
import { generalTextStyles } from '~/styles/TextStyle';

export interface TextAtomProps extends Partial<Text> {
  containerStyle?: ViewStyle | ViewStyle[];
  style?: TextStyle | TextStyle[];

  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';

  onPress?: () => void;
  onLongPress?: () => void;
}

export const TextAtom: React.FC<TextAtomProps> = props => {
  if (!props.children) {
    return <></>;
  }

  return (
    <View style={props.containerStyle}>
      <Text style={[styles.defaultTextStyles, props.style]}>{props.children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  defaultTextStyles: {
    ...generalTextStyles.mediumLittleNormalText,
    color: AppGeneralColor.TextColor.Primary,
  },
});
