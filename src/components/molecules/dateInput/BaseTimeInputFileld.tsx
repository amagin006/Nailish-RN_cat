import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text, Modal, TouchableWithoutFeedback } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import dayjs from 'dayjs';

import { TextLeftAtom } from '~/components/atoms/TextAtom';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AppGeneralColor } from '~/styles/ColorStyle';

interface BaseTimeInputFieldProps {
  onConfirm: () => string;
}

export const BaseTimeInputFileld: React.FC<BaseTimeInputFieldProps> = props => {
  const [isShowPicker, setIsShowPicker] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>('10:00');

  const pickerRef = useRef();

  const _toggleModal = () => {
    setIsShowPicker(!isShowPicker);
  };

  const _closeModal = () => {
    setIsShowPicker(false);
  };

  const _selectedValue = value => {
    console.log('value', value);
  };

  const _onValueChange = (itemValue, itemIndex) => {
    setSelectedDate(itemValue);
  };

  return (
    <View style={styles.dateBlock}>
      <View style={styles.columnWrapper}>
        <TextLeftAtom>Texttext</TextLeftAtom>
        <TouchableOpacity onPress={_toggleModal}>
          <Text>{selectedDate}</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={isShowPicker} transparent onRequestClose={_closeModal}>
        <TouchableWithoutFeedback onPress={_closeModal}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={{ flexDirection: 'row', backgroundColor: '#fff', paddingBottom: 30 }}>
          <View style={{ flex: 1 }}>
            <Picker selectedValue={_selectedValue} onValueChange={_onValueChange}>
              <Picker.Item label="Java" value="java" />
              <Picker.Item label="JavaScript" value="js" />
            </Picker>
          </View>
          <View style={{ flex: 1 }}>
            <Picker selectedValue={_selectedValue} onValueChange={_onValueChange}>
              <Picker.Item label="Java" value="java" />
              <Picker.Item label="JavaScript" value="js" />
            </Picker>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dateBlock: {
    marginVertical: 24,
  },
  columnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginVertical: 12,
  },
  textInput: {
    width: 200,
    borderBottomColor: '#9c9c9c',
    borderBottomWidth: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: AppGeneralColor.Modal.BaseBackground,
  },
});
