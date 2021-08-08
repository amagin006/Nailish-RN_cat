import React, { useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { TextAtom } from '~/components/atoms';
import { BaseTimePicker } from '~/components/molecules/DatePickerMolecules/BaseTimePicker';
import { AppGeneralColor } from '~/styles/ColorStyle';
import { generalTextStyles } from '~/styles/TextStyle';
import { Entypo } from '@expo/vector-icons';

interface EditTimeMoleculesProps {
  containerStyle?: ViewStyle | ViewStyle[];
  onConfirm: (timeValues: ITimeValue) => void;
}

export interface ITimeValue {
  startTime?: string;
  endTime?: string;
}

export enum TimeType {
  START_TIME = 'START_TIME',
  END_TIME = 'END_TIME',
}

export const EditTimeMolecules: React.FC<EditTimeMoleculesProps> = props => {
  const [startTime, setStartTime] = useState<string | undefined>();
  const [endTime, setEndTime] = useState<string | undefined>();

  // TODO: Check if endtime is valid time or not.. not supposed to be before start time
  const _onConfirm = (time: string, id?: string) => {
    let timeValues = {
      startTime: startTime,
      endTime: endTime,
    };
    if (id === TimeType.START_TIME) {
      timeValues.startTime = time;
      setStartTime(time);
    } else if (id === TimeType.END_TIME) {
      timeValues.endTime = time;
      setEndTime(time);
    }
    props.onConfirm(timeValues);
  };

  return (
    <View style={[styels.container, props.containerStyle]}>
      <View style={styels.timeBox}>
        <TextAtom style={styels.labelText}>StartTime</TextAtom>
        <BaseTimePicker
          onConfirm={_onConfirm}
          id={TimeType.START_TIME}
          timeTextStyle={styels.timeTextStyel}
        />
      </View>
      <View style={styels.arrow}>
        <Entypo name="arrow-bold-right" size={24} color={AppGeneralColor.TextColor.Primary} />
      </View>
      <View>
        <TextAtom style={styels.labelText}>EndTime</TextAtom>
        <BaseTimePicker
          onConfirm={_onConfirm}
          id={TimeType.END_TIME}
          timeTextStyle={styels.timeTextStyel}
        />
      </View>
    </View>
  );
};

const styels = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  arrow: {
    paddingTop: 15,
    marginHorizontal: 20,
  },
  labelText: {
    ...generalTextStyles.mediumThinText,
  },
  timeBox: {
    borderRadius: 20,
  },
  timeTextStyel: {
    ...generalTextStyles.boldBigXLText,
  },
});
