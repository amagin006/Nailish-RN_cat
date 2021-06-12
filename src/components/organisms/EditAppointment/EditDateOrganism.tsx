import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { CalendarList } from 'react-native-calendars';

import { ModalAtom, TextAtom } from '~/components/atoms';
import { BaseTimePicker } from '~/components/molecules/datePicker/BaseTimePicker';
import { AppGeneralColor } from '~/styles/ColorStyle';
import { generalTextStyles } from '~/styles/TextStyle';
import { Entypo } from '@expo/vector-icons';
import { BaseDatePicker } from '~/components/molecules/datePicker/BaseDatePicker';

// util
import { dateFormatte, getWeeksInMonth } from '~/util/timeUtil';

interface EditDateOrganismProps {
  containerStyle?: ViewStyle | ViewStyle[];
  onConfirm: (DateValues: IDateValue) => void;
}

export interface IDateValue {
  year: string;
  month: string;
  date: string;
}

export const EditDateOrganism: React.FC<EditDateOrganismProps> = props => {
  const today = dateFormatte(new Date());
  const [selectedDay, setSelectedDay] = useState<string>(today);
  const [weeks, setWeeks] = useState<number>(0);
  const [date, setDate] = useState<string | undefined>('2021-10-01');
  const [isOpen, setIsOpen] = useState<boolean>(false); // TODO: Move to props

  const _selectedDate = day => {
    console.log('selectedDate', day);
    setSelectedDay(day.dateString);
  };

  const _swipeMonth = months => {
    const numberOfWeeks = getWeeksInMonth(
      months[months.length - 1].year,
      months[months.length - 1].month,
    );
    setWeeks(numberOfWeeks);
  };

  const _onPress = () => {
    setIsOpen(true);
  };

  const _onClose = () => {
    setIsOpen(false);
  };

  // TODO: Check if endtime is valid time or not.. not supposed to be before start time
  const _onConfirm = (dateValues: IDateValue) => {
    props.onConfirm(dateValues);
  };

  return (
    <View style={[styels.container, props.containerStyle]}>
      <View style={styels.dateWrapper}>
        <TextAtom style={styels.labelText}>Date</TextAtom>
        <TouchableOpacity onPress={_onPress}>
          <TextAtom style={styels.dateText}>{date}</TextAtom>
        </TouchableOpacity>
      </View>
      {isOpen && (
        <ModalAtom visible={isOpen} onRequestClose={_onClose} style={styels.modalContainer}>
          <CalendarList
            onDayPress={_selectedDate}
            horizontal
            markingType={'multi-dot'}
            pagingEnabled
            hideExtraDays={false}
            // markedDates={markedDates}
            onVisibleMonthsChange={_swipeMonth}
            calendarWidth={300}
            style={styels.calenderStyle}
            // theme={{
            //   'stylesheet.calendar.header': {
            //     week: {
            //       marginTop: 0,
            //       flexDirection: 'row',
            //       justifyContent: 'space-around',
            //     },
            //     header: {
            //       flexDirection: 'row',
            //       justifyContent: 'space-between',
            //       paddingLeft: 10,
            //       paddingRight: 10,
            //       marginTop: 0,
            //       alignItems: 'center',
            //     },
            //   },
            // }}
          />
        </ModalAtom>
      )}
    </View>
  );
};

const styels = StyleSheet.create({
  container: {},
  dateWrapper: {},
  modalContainer: {
    width: 300,
  },
  calenderStyle: {
    marginTop: 20,
  },
  labelText: {
    ...generalTextStyles.mediumThinText,
  },
  dateText: {
    ...generalTextStyles.boldBigText,
  },
});
