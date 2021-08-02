import React from 'react';
import { View, Image, ViewStyle, StyleSheet, ImageStyle } from 'react-native';
import { AppGeneralColor } from '~/styles/ColorStyle';

interface BioIconProps {
  containerStyle?: ViewStyle | ViewStyle[];
  style?: ImageStyle | ImageStyle[];
  image: string;
}

export const BioIcon: React.FC<BioIconProps> = props => {
  return (
    <View style={[props.containerStyle, styles.container]}>
      <Image
        source={props.image ? { uri: `${props.image}` } : require('~assets/images/person1.png')}
        style={[styles.userIcon, props.style]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  userIcon: {
    backgroundColor: AppGeneralColor.Palette.White,
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
});
