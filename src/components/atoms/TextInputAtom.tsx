import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  TextInputProps,
  ViewStyle,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { AppGeneralColor } from '~/styles/ColorStyle';
import { TextAtom } from './TextAtom';

interface TextInputAtomProps extends Partial<TextInputProps> {
  containerStyle?: ViewStyle | ViewStyle[];
  inputTextBoxStyle?: ViewStyle;
  style?: ViewStyle;
  value?: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: boolean;
  errorText?: string;
}

export const TextInputAtom: React.FC<TextInputAtomProps> = props => {
  const borderColor = props.error
    ? AppGeneralColor.TextInput.Error
    : AppGeneralColor.TextInput.Primary;
  return (
    <View style={props.containerStyle}>
      <View style={[props.inputTextBoxStyle, styles.inputTextBox, { borderColor: borderColor }]}>
        <TextInput
          style={[props.style, styles.textInput]}
          value={props.value}
          onChangeText={props.onChangeText}
          placeholder={props.placeholder}
          onFocus={props.onFocus}
          autoCapitalize={props.autoCapitalize || 'none'}
        />
      </View>
      {!!props.errorText ? (
        <TextAtom style={[styles.errorText, { color: borderColor }]}>{props.errorText}</TextAtom>
      ) : (
        <View style={styles.errorSpace} />
      )}
    </View>
  );
};

interface PasswordTextInputProps extends TextInputAtomProps {
  isPassword?: boolean;
}

export const PasswordTextInput: React.FC<PasswordTextInputProps> = props => {
  const [isHide, setIsHide] = useState<boolean>(false);

  const borderColor = props.error
    ? AppGeneralColor.TextInput.Error
    : AppGeneralColor.TextInput.Primary;
  return (
    <View style={[props.containerStyle, styles.inputTextBox, { borderColor: borderColor }]}>
      <TextInput
        style={[props.style, styles.textInput]}
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        onFocus={props.onFocus}
        autoCapitalize={props.autoCapitalize || 'none'}
        secureTextEntry={isHide}
      />
      {props.isPassword && (
        <TouchableOpacity onPress={() => setIsHide(!isHide)}>
          <Ionicons style={styles.eyeIcon} name={isHide ? 'md-eye-off' : 'md-eye'} size={26} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputTextBox: {
    borderWidth: 1,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  eyeIcon: {
    paddingTop: 3,
  },
  errorText: {
    marginTop: 4,
  },
  errorSpace: {
    marginTop: 20,
  },
});
