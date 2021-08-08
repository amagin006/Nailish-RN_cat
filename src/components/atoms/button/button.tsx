import React, { ReactElement } from 'react';
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity, TextStyle } from 'react-native';
import { AppGeneralColor } from '~/styles/ColorStyle';

interface BaseButtonProps {
  constinerStyle?: ViewStyle | ViewStyle[];
  style?: ViewStyle | ViewStyle[];

  buttonColorType?: IButtonColorType;
  onPress: () => void;
  text?: string;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export enum IButtonColorType {
  Primary = 'Primary',
  Secondary = 'Secondary',
  Confirm = 'Confirm',
  Alert = 'Alert',
  Warning = 'Warning',
  Disabled = 'Disabled',
}

const createButtonColor = (type: IButtonColorType | undefined) => {
  switch (type) {
    case IButtonColorType.Primary:
      return styles.buttonPrimary;
    case IButtonColorType.Secondary:
      return styles.buttonSecondary;
    case IButtonColorType.Confirm:
      return styles.buttonConfirm;
    case IButtonColorType.Alert:
      return styles.buttonAlert;
    case IButtonColorType.Warning:
      return styles.buttonWarning;
    case IButtonColorType.Disabled:
      return styles.buttonDisabled;
    default:
      return styles.buttonPrimary;
  }
};

export const BaseButton: React.FC<BaseButtonProps> = props => {
  const buttonColor = createButtonColor(props.buttonColorType);
  const color = props.disabled ? styles.buttonDisabled : buttonColor || styles.defaltColor;
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

  buttonColorType?: IButtonColorType;
  onPress: () => void;
  text?: string;
  textStyle?: TextStyle;
  iconLeft?: ReactElement;
  disabled?: boolean;
}

export const RoundButton: React.FC<RoundButtonProps> = props => {
  const buttonColor = createButtonColor(props.buttonColorType);
  const color = props.disabled ? styles.buttonDisabled : buttonColor || styles.defaltColor;
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
  buttonPrimary: {
    backgroundColor: AppGeneralColor.Button.Primary,
  },
  buttonSecondary: {
    backgroundColor: AppGeneralColor.Button.Secondary,
  },
  buttonConfirm: {
    backgroundColor: AppGeneralColor.Button.Confirm,
  },
  buttonAlert: {
    backgroundColor: AppGeneralColor.Button.Alert,
  },
  buttonWarning: {
    backgroundColor: AppGeneralColor.Button.Warning,
  },
  buttonDisabled: {
    backgroundColor: AppGeneralColor.Button.Disabled,
  },
});
