import React from 'react';
import {
  View,
  Modal,
  ModalProps,
  StyleSheet,
  ViewStyle,
  TouchableWithoutFeedback,
} from 'react-native';
import { AppGeneralColor } from '~/styles/ColorStyle';

interface ModalAtomProps extends Partial<ModalProps> {
  visible: boolean;
  onRequestClose: () => void;

  containerStyle?: ViewStyle | ViewStyle[];
  modalBackStyle?: ViewStyle | ViewStyle[];
  modalInnerStyle?: ViewStyle | ViewStyle[];
}

export const ModalAtom: React.FC<ModalAtomProps> = props => {
  return (
    <Modal
      animationType={props.animationType || 'fade'}
      transparent={true}
      visible={props.visible}
      style={props.containerStyle}
      onRequestClose={props.onRequestClose}>
      <TouchableWithoutFeedback onPress={props.onRequestClose}>
        <View style={[styles.modalBack, props.modalBackStyle]}>
          <TouchableWithoutFeedback onPress={() => null}>
            <View style={[styles.modalInner, props.modalInnerStyle]}>{props.children}</View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBack: {
    flex: 1,
    backgroundColor: AppGeneralColor.Modal.BaseBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalInner: {
    backgroundColor: AppGeneralColor.Modal.BaseInner,
    width: '90%',
    minHeight: '60%',
    paddingHorizontal: '5%',
    borderRadius: 20,
  },
});
