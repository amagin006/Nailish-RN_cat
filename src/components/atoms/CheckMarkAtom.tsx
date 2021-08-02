import React from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

// style
import { AppGeneralColor } from '~/styles/ColorStyle';

interface CheckMarkAtomProps {
  container?: ViewStyle | ViewStyle[];

  isChecked: boolean;
  size?: number;
  color?: string;
  onCheck?: () => void;
  disabled?: boolean;
}

export const CheckMarkAtom: React.FC<CheckMarkAtomProps> = props => {
  return (
    <View style={props.container}>
      {props.isChecked ? (
        <TouchableOpacity onPress={props.onCheck} disabled={props.disabled}>
          <FontAwesome5
            name="check-circle"
            size={props.size || 24}
            color={props.color || AppGeneralColor.checkMarkAtom.lineBorder}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={props.onCheck} disabled={props.disabled}>
          <FontAwesome5
            name="circle"
            size={props.size || 24}
            color={props.color || AppGeneralColor.checkMarkAtom.lineBorder}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
