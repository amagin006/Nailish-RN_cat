import React, { ReactElement } from 'react';
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity, TextStyle } from 'react-native';
import { AppGeneralColor } from '~/styles/ColorStyle';

interface BaseButtonProps {
  constinerStyle?: ViewStyle | ViewStyle[];
  style?: ViewStyle | ViewStyle[];

  onPress: () => void;
  text?: string;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export const BaseButton: React.FC<BaseButtonProps> = props => {
  const color = props.disabled ? styles.buttonDisabled : styles.defaltColor;
  return (
    <View style={props.constinerStyle}>
      <TouchableOpacity
        onPress={props.onPress}
        disabled={props.disabled}
        style={[styles.buttonWrapper, color, props.style]}>
        {props.text && <Text style={[styles.text, props.textStyle]}>{props.text}</Text>}
      </TouchableOpacity>
    </View>
  );
};

interface RoundButtonProps {
  containerStyle?: ViewStyle | ViewStyle[];
  style?: ViewStyle | ViewStyle[];

  onPress: () => void;
  text?: string;
  textStyle?: TextStyle;
  iconLeft?: ReactElement;
  disabled?: boolean;
}

export const RoundButton: React.FC<RoundButtonProps> = props => {
  const color = props.disabled ? styles.buttonDisabled : props.style || styles.defaltColor;
  return (
    <View style={props.containerStyle}>
      <TouchableOpacity
        onPress={props.onPress}
        disabled={props.disabled}
        style={[styles.roundButtonWrapper, color]}>
        {props.iconLeft && <>{props.iconLeft}</>}
        {props.text && <Text style={[styles.text, props.textStyle]}>{props.text}</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    marginVertical: 10,
    borderRadius: 10,
  },
  defaltColor: {
    backgroundColor: AppGeneralColor.Button.Primary,
  },
  deleteColor: {
    backgroundColor: '#de1421',
  },
  text: {
    paddingVertical: 10,
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  roundButtonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#96CEB4',
    flexDirection: 'row',
    marginTop: 10,
    borderRadius: 18,
    marginHorizontal: 20,
  },
  buttonDisabled: {
    backgroundColor: AppGeneralColor.Button.Disabled,
  },
});
