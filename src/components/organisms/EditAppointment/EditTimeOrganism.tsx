import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextAtom } from '~/components/atoms';
import { BaseTimePicker } from '~/components/molecules/datePicker/BaseTimePicker';
import { AppGeneralColor } from '~/styles/ColorStyle';
import { generalTextStyles } from '~/styles/TextStyle';
import { Entypo } from '@expo/vector-icons';

interface EditTimeOrganismProps {
  onConfirm: (timeValues: ITimeValue) => void;
  id?: string;
}

export interface ITimeValue {
  startTime?: string;
  endTime?: string;
}

const START_TIME = 'START_TIME';
const END_TIME = 'END_TIME';

export const EditTimeOrganism: React.FC<EditTimeOrganismProps> = props => {
  const [startTime, setStartTime] = useState<string | undefined>();
  const [endTime, setEndTime] = useState<string | undefined>();

  // TODO: Check if endtime is valid time or not.. not supposed to be before start time
  const _onConfirm = (time: string, id?: string) => {
    let timeValues = {
      startTime: startTime,
      endTime: endTime,
    };
    if (id === START_TIME) {
      timeValues.startTime = time;
      setStartTime(time);
    } else if (id === END_TIME) {
      timeValues.endTime = time;
      setEndTime(time);
    }
    props.onConfirm(timeValues);
  };

  return (
    <View style={styels.container}>
      <View style={styels.timeBox}>
        <TextAtom style={styels.labelText}>StartTime</TextAtom>
        <BaseTimePicker
          onConfirm={_onConfirm}
          id={START_TIME}
          timeTextStyle={styels.timeTextStyel}
        />
      </View>
      <View style={styels.arrow}>
        <Entypo name="arrow-bold-right" size={24} color={AppGeneralColor.TextColor.Primary} />
      </View>
      <View>
        <TextAtom style={styels.labelText}>EndTime</TextAtom>
        <BaseTimePicker onConfirm={_onConfirm} id={END_TIME} timeTextStyle={styels.timeTextStyel} />
      </View>
    </View>
  );
};

const styels = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    paddingTop: 10,
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
