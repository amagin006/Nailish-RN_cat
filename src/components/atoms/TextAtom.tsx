import React from 'react';
import { View, Text, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { AppGeneralColor } from '~/styles/ColorStyle';
import { generalTextStyles } from '~/styles/TextStyle';
import { GeneralViewStyle } from '~/styles/ViewStyle';

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
      <Text
        style={[styles.defaultTextStyles, props.style]}
        numberOfLines={props.numberOfLines}
        ellipsizeMode={props.ellipsizeMode}>
        {props.children}
      </Text>
    </View>
  );
};

export const TextLeftAtom: React.FC<TextAtomProps> = props => {
  if (!props.children) {
    return <></>;
  }

  return (
    <View style={[GeneralViewStyle.leftColumn, props.containerStyle]}>
      <Text
        numberOfLines={props.numberOfLines}
        ellipsizeMode={props.ellipsizeMode}
        style={[GeneralViewStyle.leftColumnText, props.style]}>
        {props.children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  defaultTextStyles: {
    ...generalTextStyles.mediumLittleNormalText,
    color: AppGeneralColor.TextColor.Primary,
  },
});
