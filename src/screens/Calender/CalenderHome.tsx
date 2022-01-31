import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import { Feather } from '@expo/vector-icons';

// navigation
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  MainStackNavParamList,
  BottomTabNavParamList,
  CalenderStackNavParamsList,
} from '~/route/types';
import { AppGeneralColor } from '~/styles/ColorStyle';

// util
import { dateFormate, getWeeksInMonth } from '~/util/timeUtil';
import { CalenderServices } from '~/modules/Calender/CalenderServices';
import { useAppSelector } from '~/redux/hooks';
import { ICustomerReport } from '~/modules/CustomerList/CustomerListInterfaces';

var nextDay = [
  '2022-01-01',
  '2022-02-05',
  '2022-02-08',
  '2022-02-07',
  '2022-02-18',
  '2022-02-17',
  '2022-02-28',
  '2022-02-29',
];

function makeMarked(appointDates: ICustomerReport[]): { [time: string]: object } {
  const markedApp = appointDates.reduce((c, v) => {
    return Object.assign(c, {
      [v.date.dateString]: {
        dots: [{ key: 'appointment', color: 'red' }],
        marked: true,
      },
    });
  }, {});
  console.log('markedApp', markedApp);
  return markedApp;
}

type CustomerListNavProps = CompositeNavigationProp<
  StackNavigationProp<MainStackNavParamList, 'BottomNav'>,
  CompositeNavigationProp<
    BottomTabNavigationProp<BottomTabNavParamList, 'Calender'>,
    StackNavigationProp<CalenderStackNavParamsList, 'CalenderHome'>
  >
>;

interface CalenderHomeProps {
  navigation: CustomerListNavProps;
}

const CalenderHome: React.FC<CalenderHomeProps> = ({ navigation }) => {
  const today = dateFormate(new Date());
  const [selectedDay, setSelectedDay] = useState<string>(today);
  const [markedDates, setMarkedDates] = useState({});
  const [weeks, setWeeks] = useState<number>();
  const [calenderItems, setCalenderItems] = useState<ICustomerReport[]>([]);
  const userRedux = useAppSelector(state => state.user);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity onPress={_addCustomerReport} style={styles.headerRightSave}>
            <Feather name="plus" size={32} color="#fff" />
          </TouchableOpacity>
        );
      },
    });
  }, []);

  useEffect(() => {
    const _getCalenderItem = async () => {
      const calenderItems = await CalenderServices.getCalenderItems(userRedux);
      const markedAppointment = makeMarked(calenderItems);
      markedAppointment[selectedDay] = {
        ...markedAppointment[selectedDay],
        selected: true,
        disableTouchEvent: true,
      }; // initail selected item (today)

      setMarkedDates(markedAppointment); // mark red dot on calender
      setCalenderItems(calenderItems);
    };

    _getCalenderItem();
  }, [selectedDay]);

  const _addCustomerReport = () => {
    console.log('addCustomerReport');
    navigation.navigate('EditAppointment');
  };

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

  const _onPressList = item => {
    console.log('_onPressList', item);
    navigation.navigate('EditAppointment', { item: item });
  };

  const _renderFlatListItem = listItem => {
    const { item } = listItem;
    return (
      <TouchableOpacity onPress={() => _onPressList(item)} style={styles.listItemWrapper}>
        <Image source={{ uri: `${item.user.profileImg}` }} style={styles.userIcon} />
        <View style={styles.textWrapper}>
          <Text style={styles.name}>{`${item.user.firstName} ${item.user.lastName}`}</Text>
          <Text style={styles.time}>{`${item.appointmentStart} ~ ${item.appointmentEnd}`}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <CalendarList
        onDayPress={_selectedDate}
        horizontal={true}
        markingType={'multi-dot'}
        pagingEnabled={true}
        hideExtraDays={false}
        markedDates={markedDates}
        onVisibleMonthsChange={_swipeMonth}
        style={{ height: 350 }}
        theme={{
          'stylesheet.calendar.header': {
            week: {
              marginTop: 0,
              flexDirection: 'row',
              justifyContent: 'space-around',
            },
          },
        }}
      />
      <View style={styles.calenderSparator} />
      <FlatList
        data={FAKEDATA}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={item => `${item.id}`}
        renderItem={_renderFlatListItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerRightSave: {
    marginRight: 14,
  },
  calenderSparator: {
    borderBottomWidth: 3,
    borderBottomColor: AppGeneralColor.Palette.SecondalyPink,
  },
  listItemWrapper: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: '5%',
    alignItems: 'center',
  },
  textWrapper: {
    marginLeft: 20,
  },
  userIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  name: {
    fontSize: 16,
  },
  time: {
    fontSize: 14,
    color: '#b0b0b0',
    marginTop: 5,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: AppGeneralColor.Calender.listSeparator,
  },
});

export default CalenderHome;

const FAKEDATA = [
  {
    id: '1',
    appointmentDate: '2022-01-12',
    appointmentStart: '18:00',
    appointmentEnd: '20:00',
    user: {
      id: 1,
      firstLetter: 'A',
      firstName: 'Assuly',
      lastName: 'Henry',
      profileImg: 'https://storage.googleapis.com/nailish-firebase.appspot.com/temp/01.jpg',
      instagram: '',
      mail: '',
      birthday: '',
      memo: '',
      mobile: '',
      twitter: '',
      lastVisit: '2020/01/02',
    },
  },
  {
    id: '2',
    appointmentDate: '2022-02-29',
    appointmentStart: '18:00',
    appointmentEnd: '20:00',
    user: {
      id: 2,
      firstLetter: 'B',
      firstName: 'Bssuly',
      lastName: 'Henry',
      profileImg: 'https://storage.googleapis.com/nailish-firebase.appspot.com/temp/01.jpg',
      instagram: '',
      mail: '',
      birthday: '',
      memo: '',
      mobile: '',
      twitter: '',
      lastVisit: '2020/01/02',
    },
  },
  {
    id: '3',
    appointmentDate: '2022-03-12',
    appointmentStart: '18:00',
    appointmentEnd: '20:00',
    user: {
      id: 3,
      firstLetter: 'C',
      firstName: 'Cssuly',
      lastName: 'Henry',
      profileImg: 'https://storage.googleapis.com/nailish-firebase.appspot.com/temp/01.jpg',
      instagram: '',
      mail: '',
      birthday: '',
      memo: '',
      mobile: '',
      twitter: '',
      lastVisit: '2020/01/02',
    },
  },
  {
    id: '4',
    appointmentDate: '2022-02-12',
    appointmentStart: '18:00',
    appointmentEnd: '20:00',
    user: {
      id: 4,
      firstLetter: 'D',
      firstName: 'Dssuly',
      lastName: 'Henry',
      profileImg: 'https://storage.googleapis.com/nailish-firebase.appspot.com/temp/01.jpg',
      instagram: '',
      mail: '',
      birthday: '',
      memo: '',
      mobile: '',
      twitter: '',
      lastVisit: '2020/01/02',
    },
  },

  {
    id: '5',
    appointmentDate: '2022-02-12',
    appointmentStart: '18:00',
    appointmentEnd: '20:00',
    user: {
      id: 4,
      firstLetter: 'D',
      firstName: 'Dssuly',
      lastName: 'Henry',
      profileImg: 'https://storage.googleapis.com/nailish-firebase.appspot.com/temp/01.jpg',
      instagram: '',
      mail: '',
      birthday: '',
      memo: '',
      mobile: '',
      twitter: '',
      lastVisit: '2020/01/02',
    },
  },
  {
    id: '6',
    appointmentDate: '2022-03-02',
    appointmentStart: '18:00',
    appointmentEnd: '20:00',
    user: {
      id: 4,
      firstLetter: 'D',
      firstName: 'Dssuly',
      lastName: 'Henry',
      profileImg: 'https://storage.googleapis.com/nailish-firebase.appspot.com/temp/01.jpg',
      instagram: '',
      mail: '',
      birthday: '',
      memo: '',
      mobile: '',
      twitter: '',
      lastVisit: '2020/01/02',
    },
  },
];
