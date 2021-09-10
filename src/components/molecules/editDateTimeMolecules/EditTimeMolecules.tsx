import React, { useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { TextAtom } from '~/components/atoms';
import { BaseTimePicker } from '~/components/molecules/DatePickerMolecules/BaseTimePicker';
import { AppGeneralColor } from '~/styles/ColorStyle';
import { generalTextStyles } from '~/styles/TextStyle';
import { Entypo } from '@expo/vector-icons';
import dayjs from 'dayjs';

interface EditTimeMoleculesProps {
  containerStyle?: ViewStyle | ViewStyle[];
  onConfirm: (timeValues: ITimeValue) => void;
  startEndTime: ITimeValue;
}

export interface ITimeValue {
  startTime?: string;
  endTime?: string;
}

export enum TimeType {
  START_TIME = 'START_TIME',
  END_TIME = 'END_TIME',
}

const isStarBeforeEnd = (start: string, end: string): boolean => {
  const startTime = dayjs(`2000-01-01 ${start}`);
  const endTime = dayjs(`2000-01-01 ${end}`);
  const minDiff = endTime.diff(startTime, 'minutes', true);
  if (minDiff >= 0) {
    return true;
  }
  return false;
};

export const EditTimeMolecules: React.FC<EditTimeMoleculesProps> = props => {
  const [startTime, setStartTime] = useState<string>('00:00');
  const [endTime, setEndTime] = useState<string>('00:00');

  const _onConfirm = (time: string, id?: string) => {
    let timeValues = {
      startTime: startTime,
      endTime: endTime,
    };
    if (id === TimeType.START_TIME) {
      timeValues.startTime = time;
    } else if (id === TimeType.END_TIME) {
      timeValues.endTime = time;
    }
    props.onConfirm(timeValues);
  };

  const _onStartHourChange = (hour: string) => {
    const newStartTime = `${hour}:${startTime.slice(3, 5)}`;
    if (!isStarBeforeEnd(newStartTime, endTime)) {
      setEndTime(newStartTime);
    }
    setStartTime(newStartTime);
  };

  const _onStartMinChange = (min: string) => {
    const newStartTime = `${startTime.slice(0, 2)}:${min}`;
    if (!isStarBeforeEnd(newStartTime, endTime)) {
      setEndTime(newStartTime);
    }
    setStartTime(newStartTime);
  };

  const _onEndHourChange = (hour: string) => {
    const newEndTime = `${hour}:${startTime.slice(3, 5)}`;
    if (isStarBeforeEnd(startTime, newEndTime)) {
      setEndTime(newEndTime);
    }
  };

  const _onEndMinChange = (min: string) => {
    const newEndTime = `${startTime.slice(0, 2)}:${min}`;
    if (isStarBeforeEnd(startTime, newEndTime)) {
      setEndTime(newEndTime);
    }
  };

  return (
    <View style={[styels.container, props.containerStyle]}>
      <View style={styels.timeBox}>
        <TextAtom style={styels.labelText}>StartTime</TextAtom>
        <BaseTimePicker
          onConfirm={_onConfirm}
          onHourChange={_onStartHourChange}
          onMinChange={_onStartMinChange}
          id={TimeType.START_TIME}
          timeTextStyle={styels.timeTextStyel}
          timeValue={startTime}
        />
      </View>
      <View style={styels.arrow}>
        <Entypo name="arrow-bold-right" size={24} color={AppGeneralColor.TextColor.Primary} />
      </View>
      <View>
        <TextAtom style={styels.labelText}>EndTime</TextAtom>
        <BaseTimePicker
          onConfirm={_onConfirm}
          onHourChange={_onEndHourChange}
          onMinChange={_onEndMinChange}
          id={TimeType.END_TIME}
          timeTextStyle={styels.timeTextStyel}
          timeValue={endTime}
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
