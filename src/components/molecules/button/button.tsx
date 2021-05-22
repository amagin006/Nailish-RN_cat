import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity, TextStyle } from 'react-native';

interface BaseButtonProps {
  constinerStyle?: ViewStyle | ViewStyle[];
  style?: ViewStyle | ViewStyle[];
  onPress: () => void;
  text?: string;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export const BaseButton: React.FC<BaseButtonProps> = props => {
  return (
    <View style={props.constinerStyle}>
      <TouchableOpacity
        onPress={props.onPress}
        disabled={props.disabled}
        style={[styles.buttonWrapper, styles.defaltColor, props.style]}>
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
  disabled?: boolean;
}

export const RoundButton: React.FC<RoundButtonProps> = props => {
  return (
    <View style={props.containerStyle}>
      <TouchableOpacity
        onPress={props.onPress}
        disabled={props.disabled}
        style={[styles.roundButtonWrapper, styles.defaltColor, props.style]}>
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
    backgroundColor: '#36a4e3',
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
    marginTop: 10,
    borderRadius: 18,
    marginHorizontal: 20,
  },
});
