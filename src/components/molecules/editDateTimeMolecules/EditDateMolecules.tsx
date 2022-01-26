import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { CalendarList } from 'react-native-calendars';

import { ModalAtom, TextAtom } from '~/components/atoms';
import { generalTextStyles } from '~/styles/TextStyle';

// util
import { dateFormate } from '~/util/timeUtil';

// Type
import { DateData } from 'react-native-calendars/src/types';
import dayjs from 'dayjs';

interface EditDateMoleculesProps {
  containerStyle?: ViewStyle | ViewStyle[];
  appointmentDate: IDateValue;
  onConfirm: (DateValues: IDateValue) => void;
}

export interface IDateValue {
  year: string;
  month: string;
  date: string;
}

export interface ICalenderDateValue {
  day: number; // day of month (1-31)
  month: number; // month of year (1-12)
  year: number; // year
  timestamp: string; // UTC timestamp representing 00:00 AM of this date
  dateString: string; // date formatted as 'YYYY-MM-DD' string
}

export const EditDateMolecules: React.FC<EditDateMoleculesProps> = props => {
  const today = dateFormate(new Date());

  const [selectedDay, setSelectedDay] = useState<string>(today);
  const [markedDates, setMarkedDates] = useState({});
  const [isOpen, setIsOpen] = useState<boolean>(false); // TODO: Move to props

  useEffect(() => {
    const markDate: { [key: string]: { selected: boolean } } = {};
    markDate[today] = { selected: true };
    setMarkedDates(markDate);
  }, []);

  useEffect(() => {
    const { year, month, date } = props.appointmentDate || {};
    if (year && month && date) {
      setSelectedDay(`${year}/${month}/${date}`);
    }
  }, [props.appointmentDate]);

  const _onPress = () => {
    setIsOpen(true);
  };

  const _onClose = () => {
    setIsOpen(false);
  };

  const _selectedDate = (day: DateData) => {
    setSelectedDay(day.dateString);
    const dateValues: IDateValue = {
      year: day.year.toString(),
      month: day.month.toString().padStart(2, '0'),
      date: day.day.toString().padStart(2, '0'),
    };
    setIsOpen(false);
    props.onConfirm(dateValues);
  };

  return (
    <View style={[styles.container, props.containerStyle]}>
      <View style={styles.dateWrapper}>
        <TextAtom style={styles.labelText}>Date</TextAtom>
        <TouchableOpacity onPress={_onPress}>
          <TextAtom style={styles.dateText}>{selectedDay}</TextAtom>
        </TouchableOpacity>
      </View>
      {isOpen && (
        <ModalAtom
          visible={isOpen}
          onRequestClose={_onClose}
          modalInnerStyle={styles.modalInnerStyle}>
          <CalendarList
            onDayPress={_selectedDate}
            horizontal
            markingType={'multi-dot'}
            pagingEnabled
            hideExtraDays={false}
            markedDates={markedDates}
            hideArrows={false}
            calendarWidth={350}
            style={styles.calenderStyle}
            theme={{
              selectedDayBackgroundColor: '#00adf5',
              'stylesheet.calendar.header': {
                week: {
                  marginTop: 0,
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                },
                // header: {
                //   flexDirection: 'row',
                //   justifyContent: 'space-between',
                //   paddingLeft: 10,
                //   paddingRight: 10,
                //   marginTop: 0,
                //   alignItems: 'center',
                // },
              },
            }}
          />
        </ModalAtom>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  dateWrapper: {},
  calenderStyle: {
    marginTop: 20,
    width: 350,
  },
  labelText: {
    ...generalTextStyles.mediumThinText,
  },
  dateText: {
    ...generalTextStyles.boldBigText,
  },
  modalInnerStyle: {
    alignItems: 'center',
    minHeight: 200,
    height: 400,
    paddingBottom: 10,
  },
});
