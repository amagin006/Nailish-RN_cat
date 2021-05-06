import React from 'react';
import { View, Modal, ModalProps, StyleSheet, ViewStyle } from 'react-native';
import { AppGeneralColor } from '~/styles/ColorStyle';

interface ModalAtomProps extends Partial<ModalProps> {
  visible: boolean;
  onRequestClose: () => void;

  modalBackStyle?: ViewStyle | ViewStyle[];
  modalInnerStyle?: ViewStyle | ViewStyle[];
}

export const ModalAtom: React.FC<ModalAtomProps> = props => {
  return (
    <Modal
      animationType={props.animationType || 'fade'}
      transparent={true}
      visible={props.visible}
      onRequestClose={props.onRequestClose}>
      <View style={[styles.modalBack, props.modalBackStyle]}>
        <View style={[styles.modalInner, props.modalInnerStyle]}>{props.children}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBack: {
    height: '100%',
    backgroundColor: AppGeneralColor.Modal.BaseBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalInner: {
    backgroundColor: AppGeneralColor.Modal.BaseInner,
    width: '90%',
    height: '60%',
    paddingHorizontal: '5%',
    borderRadius: 20,
  },
});
