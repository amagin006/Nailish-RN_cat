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

interface TextInputAtomProps extends Partial<TextInputProps> {
  containerStyle?: ViewStyle | ViewStyle[];
  style?: ViewStyle | ViewStyle[];
  value?: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: boolean;

  // password
  isPassword?: boolean;
}

export const TextInputAtom: React.FC<TextInputAtomProps> = props => {
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
  textInput: {
    flex: 1,
    paddingVertical: 8,
  },
  inputTextBox: {
    borderWidth: 1,
    paddingVertical: Platform.OS === 'ios' ? 5 : 0,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eyeIcon: {
    paddingTop: 3,
  },
});
