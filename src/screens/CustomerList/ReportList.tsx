import React, { useLayoutEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import dayjs from 'dayjs';
import { FontAwesome } from '@expo/vector-icons';

// navigation
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackNavParamList } from '~/route/types';

import { GeneralNavStyles } from '~/styles/ViewStyle';
import SnsButtons from '~/components/button/snsButtons';
import { BioIcon } from '~/components/photoIcon/BioIcon';
import { useAppSelector } from '~/redux/hooks';
import CustomerModel from '~/modules/customer/services/cusomerModels';

interface ReportListProps {
  navigation: StackNavigationProp<MainStackNavParamList, 'CustomerEdit'>;
}

const ReportList: React.FC<ReportListProps> = ({ navigation }) => {
  const customer: CustomerModel = useAppSelector(state => state.customer?.selectedCustomer);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Edit Report',
      headerRight: () => {
        return (
          <TouchableOpacity style={GeneralNavStyles.headerRight} onPress={_onEdit}>
            <Text style={GeneralNavStyles.headerRightText}>Edit</Text>
          </TouchableOpacity>
        );
      },
    });
  }, [navigation]);

  const _onAddNewReport = () => {
    console.log('_onAddNewReport');
    navigation.navigate('ReportEdit');
  };

  const _onEdit = () => {
    navigation.navigate('CustomerEdit');
  };

  const _keyExtractor = item => item.id;

  const _onPressCard = item => {
    console.log('onPressCard', item);
    navigation.navigate('ReportDetail', { appointItem: item.item });
  };

  const _renderItem = item => {
    const date = dayjs(item.item.appointmentStart).format('YYYY/MM/DD');
    const startTime = dayjs(item.item.appointmentStart).format('HH:mm');
    const endTime = dayjs(item.item.appointmentEnd).format('HH:mm');
    return (
      <TouchableOpacity onPress={() => _onPressCard(item)} style={styles.reportCardWrapper}>
        <Image style={styles.cardImage} source={{ uri: `${item.item.photo[0].url}` }} />
        <View style={styles.textWrapper}>
          <Text style={styles.dateText}>{date}</Text>
          <Text style={styles.timeText}>{`${startTime} ~ ${endTime}`}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const _listHeader = () => {
    return (
      <View style={styles.customerInfoBox}>
        <View style={styles.customerIconWrapper}>
          <BioIcon image={customer.profileImg} style={styles.customerIcon} />
        </View>
        <Text style={styles.name}>{`${customer.firstName} ${customer.lastName}`}</Text>
        {customer.birthday ? (
          <View style={styles.birthDayWrapper}>
            <FontAwesome name={'birthday-cake'} style={styles.birthDayIcon} />
            <Text style={styles.birthDay}>{customer.birthday}</Text>
          </View>
        ) : null}
        <View style={styles.snsCenterBox}>
          <SnsButtons customer={customer} />
        </View>
        <TouchableOpacity style={styles.newReportButton} onPress={_onAddNewReport}>
          <FontAwesome name={'file-text-o'} style={styles.newReportIcon} />
          <Text style={styles.newReportText}>New Report</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={FAKE_DATA.report}
        keyExtractor={_keyExtractor}
        ListHeaderComponent={_listHeader}
        ListHeaderComponentStyle={styles.listHeader}
        renderItem={_renderItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  customerInfoBox: {
    marginHorizontal: '2%',
    marginTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  customerIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  customerIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
    marginTop: -60,
  },
  name: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 16,
  },
  birthDayWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 10,
  },
  birthDayIcon: {
    color: '#666666',
    fontSize: 16,
  },
  birthDay: {
    marginLeft: 8,
    fontSize: 13,
    color: '#666666',
  },
  snsCenterBox: {
    marginTop: 20,
    alignItems: 'center',
  },
  newReportButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    backgroundColor: '#3A9E55',
    borderRadius: 18,
    marginHorizontal: '5%',
    paddingVertical: 8,
  },
  newReportIcon: {
    fontSize: 24,
    color: '#fff',
  },
  newReportText: {
    marginLeft: 20,
    fontSize: 20,
    color: '#fff',
  },
  listHeader: {
    marginBottom: 20,
  },
  reportCardWrapper: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8ED',
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  cardImage: {
    width: 55,
    height: 55,
    borderRadius: 6,
  },
  textWrapper: {
    marginLeft: 18,
    marginRight: 10,
  },
  dateText: {
    fontSize: 19,
    color: '#2b2b2b',
  },
  timeText: {
    marginTop: 10,
    fontSize: 16,
    color: '#828282',
  },
});

export default ReportList;

const FAKE_DATA = {
  user: {
    id: 1,
    firstName: 'Assuly',
    lastName: 'Henry',
    userIcon: 'https://storage.googleapis.com/nailish-firebase.appspot.com/temp/01.jpg',
    lastVisit: '2020/01/02',
    nameInitial: 'A',
  },
  report: [
    {
      id: '1',
      appointmentStart: '2020-02-08 12:00',
      appointmentEnd: '2020-02-08 14:00',
      photo: [
        {
          id: 'aaa',
          url: 'https://storage.googleapis.com/nailish-firebase.appspot.com/temp/nailsample1.jpg',
        },
        {
          id: 'aab',
          url: 'https://storage.googleapis.com/nailish-firebase.appspot.com/temp/nailsample2.jpg',
        },
        {
          id: 'aac',
          url: 'https://storage.googleapis.com/nailish-firebase.appspot.com/temp/nailsample1.jpg',
        },
        {
          id: 'aad',
          url: 'https://storage.googleapis.com/nailish-firebase.appspot.com/temp/nailsample2.jpg',
        },
      ],
      menu: [
        {
          menuItem: 'jeldsffsdkfdkkjsdkjsjkjlkkljkljkljkljlkjlkjlkjkl',
          price: '20',
          bgcolor: '#FF9F9F',
        },
        { menuItem: 'off', price: '30', bgcolor: '#87D1AA' },
        { menuItem: 'Design', price: '40', bgcolor: '#AC71D1' },
      ],
    },
    {
      id: '2',
      appointmentStart: '2020-02-23 18:00',
      appointmentEnd: '2020-02-23 20:00',
      photo: [
        {
          id: 'aba',
          url: 'https://storage.googleapis.com/nailish-firebase.appspot.com/temp/nailsample2.jpg',
        },
        {
          id: 'abb',
          url: 'https://storage.googleapis.com/nailish-firebase.appspot.com/temp/nailsample1.jpg',
        },
        {
          id: 'abc',
          url: 'https://storage.googleapis.com/nailish-firebase.appspot.com/temp/nailsample2.jpg',
        },
        {
          id: 'abd',
          url: 'https://storage.googleapis.com/nailish-firebase.appspot.com/temp/nailsample1.jpg',
        },
      ],
      menu: [
        { menuItem: 'jel', price: '20', bgcolor: '#FF9F9F' },
        { menuItem: 'off', price: '30', bgcolor: '#87D1AA' },
        { menuItem: 'Design', price: '40', bgcolor: '#AC71D1' },
      ],
    },
    {
      id: '3',
      appointmentStart: '2020-03-08 12:00',
      appointmentEnd: '2020-03-08 18:00',
      photo: [
        {
          id: 'aca',
          url: 'https://storage.googleapis.com/nailish-firebase.appspot.com/temp/nailsample1.jpg',
        },
        {
          id: 'acb',
          url: 'https://storage.googleapis.com/nailish-firebase.appspot.com/temp/nailsample2.jpg',
        },
        {
          id: 'acc',
          url: 'https://storage.googleapis.com/nailish-firebase.appspot.com/temp/nailsample1.jpg',
        },
        {
          id: 'acd',
          url: 'https://storage.googleapis.com/nailish-firebase.appspot.com/temp/nailsample2.jpg',
        },
      ],
      menu: [
        { menuItem: 'jel', price: '20', bgcolor: '#FF9F9F' },
        { menuItem: 'off', price: '30', bgcolor: '#87D1AA' },
        { menuItem: 'Design', price: '40', bgcolor: '#AC71D1' },
      ],
    },
  ],
};
