import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableWithoutFeedback, TextStyle } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { TextAtom } from '~/components/atoms/TextAtom';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AppGeneralColor } from '~/styles/ColorStyle';

import {
  TIME_HOUR,
  TIME_MINITES,
} from '~/components/molecules/DatePickerMolecules/DatePickerHelper';
import { generalTextStyles } from '~/styles/TextStyle';

interface BaseDatePickerProps {
  onConfirm: (time: string, id?: string) => void;
  id?: string;
  timeTextStyle?: TextStyle;
}

export const BaseDatePicker: React.FC<BaseDatePickerProps> = props => {
  const [isShowPicker, setIsShowPicker] = useState<boolean>(false);
  const [selectedHour, setSelectedHour] = useState<string>('00');
  const [selectedMin, setSelectedMin] = useState<string>('00');

  const _toggleModal = () => {
    setIsShowPicker(!isShowPicker);
  };

  const _closeModal = () => {
    setIsShowPicker(false);
    props.onConfirm(`${selectedHour}:${selectedMin}`, props.id);
  };

  const _onHourChange = (itemValue, itemIndex) => {
    setSelectedHour(itemValue);
  };

  const _onMinutesChange = (itemValue, itemIndex) => {
    setSelectedMin(itemValue);
  };

  return (
    <View>
      <TouchableOpacity onPress={_toggleModal}>
        <TextAtom
          style={[
            styles.timeText,
            props.timeTextStyle ? props.timeTextStyle : {},
            isShowPicker ? styles.isSelctedTimeText : {},
          ]}>{`${selectedHour}:${selectedMin}`}</TextAtom>
      </TouchableOpacity>
      <Modal visible={isShowPicker} transparent onRequestClose={_closeModal}>
        <TouchableWithoutFeedback onPress={_closeModal}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View>
          <View style={{ backgroundColor: '#fff', alignItems: 'flex-end' }}>
            <TouchableOpacity
              onPress={_closeModal}
              style={{ paddingVertical: 10, paddingHorizontal: 20 }}>
              <TextAtom style={{ color: AppGeneralColor.TextColor.Link }}>Done</TextAtom>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#fff',
              paddingBottom: 30,
            }}>
            <View style={{ width: '50%', alignItems: 'flex-end' }}>
              <Picker
                style={{ width: 100 }}
                selectedValue={selectedHour}
                itemStyle={{}}
                onValueChange={_onHourChange}>
                {TIME_HOUR.map(item => {
                  return (
                    <Picker.Item
                      key={`${item.value}`}
                      label={`${item.label}`}
                      value={`${item.value}`}
                    />
                  );
                })}
              </Picker>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'flex-start',
              }}>
              <Picker
                style={{ width: 100 }}
                selectedValue={selectedMin}
                onValueChange={_onMinutesChange}>
                {TIME_MINITES.map(item => {
                  return (
                    <Picker.Item
                      key={`${item.value}`}
                      label={`${item.label}`}
                      value={`${item.value}`}
                    />
                  );
                })}
              </Picker>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'flex-start',
              }}>
              <Picker
                style={{ width: 100 }}
                selectedValue={selectedMin}
                onValueChange={_onMinutesChange}>
                {TIME_MINITES.map(item => {
                  return (
                    <Picker.Item
                      key={`${item.value}`}
                      label={`${item.label}`}
                      value={`${item.value}`}
                    />
                  );
                })}
              </Picker>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    width: 200,
    borderBottomColor: '#9c9c9c',
    borderBottomWidth: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: AppGeneralColor.Modal.BaseBackground,
  },
  timeText: {
    ...generalTextStyles.boldBigText,
  },
  isSelctedTimeText: {
    color: AppGeneralColor.TextColor.Link,
  },
});
