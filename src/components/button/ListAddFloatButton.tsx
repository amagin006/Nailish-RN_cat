import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface ListAddFloatButtonProps {
  style?: ViewStyle | ViewStyle[];
  iconStyle?: TextStyle | TextStyle[];
  onPress: () => void;
}

export const ListAddFloatButton: React.FC<ListAddFloatButtonProps> = props => {
  return (
    <TouchableOpacity style={[styles.addButton, props.style]} onPress={props.onPress}>
      <FontAwesome style={[styles.addIcon, props.iconStyle]} name={'plus'} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 50,
    height: 50,
    paddingTop: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#D9534F',
  },
  addIcon: {
    fontSize: 36,
    color: '#fff',
  },
});
