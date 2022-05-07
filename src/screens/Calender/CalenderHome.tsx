import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
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
import { ICustomerReport } from '~/modules/Customer/CustomerListInterfaces';
import dayjs from 'dayjs';
import { DateData } from 'react-native-calendars/src/types';

type CalenderMarkType = {
  [data: string]: {
    dots: { key: string; color: string }[];
    marked: boolean;
    selected: boolean;
    disableTouchEvent: boolean;
  };
};

function makeMarked(appointDates: ICustomerReport[]): CalenderMarkType {
  const markedApp = appointDates.reduce((c, v) => {
    return Object.assign(c, {
      [v.date.dateString]: {
        dots: [{ key: 'appointment', color: 'red' }],
        marked: true,
        selected: false,
        disableTouchEvent: false,
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
  const [markedDates, setMarkedDates] = useState<{
    [time: string]: {
      dots: { key: string; color: string }[];
      marked: boolean;
      selected?: boolean;
      disableTouchEvent?: boolean;
    };
  }>({});
  const [weeks, setWeeks] = useState<number>();
  const [calenderItems, setCalenderItems] = useState<ICustomerReport[]>([]);
  const [selectedDateItems, setSelectedDateItems] = useState<ICustomerReport[]>([]);
  // Redux
  const userRedux = useAppSelector(state => state.user);
  // Ref
  const calendarRef = useRef<CalendarList | null>(null);

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
      const today = dayjs().format('YYYY-MM-DD');
      const todayItemList = getSelectedDateList(calenderItems, today);
      const markedAppointment = makeMarked(calenderItems);
      markedAppointment[today] = {
        ...markedAppointment[today],
        selected: true,
        disableTouchEvent: true,
      }; // initail selected item (today)

      setMarkedDates(markedAppointment); // mark red dot on calender
      setCalenderItems(calenderItems);
      setSelectedDateItems(todayItemList); // item list for selected date items
    };

    _getCalenderItem();
  }, []);

  // Get items on selectedDate
  const getSelectedDateList = (calenderItems: ICustomerReport[], selectedDate: string) => {
    return calenderItems.filter(item => item.date.dateString === selectedDate); // selectedDate: YYYY-MM-DD
  };

  const _addCustomerReport = () => {
    navigation.navigate('EditAppointment');
  };

  const _selectedDate = (day: DateData) => {
    const selectedDateItems = getSelectedDateList(calenderItems, day.dateString);
    setSelectedDateItems(selectedDateItems);

    const newMark = { ...markedDates };
    // remove mark from privios date
    if (!newMark[selectedDay].dots) {
      delete newMark[selectedDay];
    } else {
      newMark[selectedDay] = {
        ...newMark[selectedDay],
        selected: false,
        disableTouchEvent: false,
      };
    }

    // add mark to selected date
    newMark[day.dateString] = {
      ...newMark[day.dateString],
      selected: true,
      disableTouchEvent: true,
    };

    setMarkedDates(newMark);
    setSelectedDay(day.dateString);
  };

  const _swipeMonth = (months: DateData[]) => {
    const numberOfWeeks = getWeeksInMonth(
      months[months.length - 1].year,
      months[months.length - 1].month,
    );
    setWeeks(numberOfWeeks);
  };

  const _onPressList = (item: ICustomerReport) => {
    console.log('item', item);
    navigation.navigate('EditAppointment', { item: item });
  };

  const _renderFlatListItem = ({ item }: { item: ICustomerReport }) => {
    return (
      <TouchableOpacity onPress={() => _onPressList(item)} style={styles.listItemWrapper}>
        <View style={styles.textWrapper}>
          <Text style={styles.name}>{`${item.customerFirstName} ${item.customerLastName}`}</Text>
          <Text
            style={
              styles.time
            }>{`${item.startEndtime.startTime} ~ ${item.startEndtime.endTime}`}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const _onListHeaderToday = () => {
    const today = dayjs().format('YYYY-MM-DD');
    // @ts-ignore - first parms type is XDate but I down't won't install another library.
    // It works date as new Date() for now.
    calendarRef.current?.scrollToDay(new Date(), undefined, true);
  };

  return (
    <View style={{ flex: 1 }}>
      <CalendarList
        ref={calendarRef}
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
      <FlatList
        data={selectedDateItems}
        keyExtractor={item => `${item.id}`}
        renderItem={_renderFlatListItem}
        ListHeaderComponent={<ListHeader onPress={_onListHeaderToday} />}
      />
    </View>
  );
};

interface ListHeaderProps {
  onPress: () => void;
}
const ListHeader: React.FC<ListHeaderProps> = ({ onPress }) => {
  return (
    <View style={styles.listHeader}>
      <TouchableOpacity onPress={onPress} style={styles.listHeaderButton}>
        <Text style={styles.listHeaderText}>Today</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRightSave: {
    marginRight: 14,
  },
  listItemWrapper: {
    flexDirection: 'row',
    paddingVertical: 18,
    paddingHorizontal: '5%',
    alignItems: 'center',
    borderBottomColor: AppGeneralColor.Calender.listSeparator,
    borderBottomWidth: 1,
  },
  listHeader: {
    alignItems: 'flex-end',
    backgroundColor: AppGeneralColor.Calender.listHeaderBackground,
    padding: 4,
    marginRight: 4,
  },
  listHeaderButton: {
    padding: 10,
  },
  listHeaderText: {
    fontSize: 14,
    color: AppGeneralColor.TextColor.Link,
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
});

export default CalenderHome;
