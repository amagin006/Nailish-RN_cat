import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';

// navigation
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { MainStackNavParamList } from '~/route/types';

// Redux
import { useAppDispatch, useAppSelector } from '~/redux/hooks';

// component
import { IButtonColorType, RoundButton } from '~/components/atoms/button/button';
import ReportMenuList from '~/components/organisms/ReportDetailOrganisms/ReportMenuList';
import { IDateValue } from '~/components/molecules/EditDateTimeMolecules/EditDateMolecules';
import { ITimeValue } from '~/components/molecules/EditDateTimeMolecules/EditTimeMolecules';
import CustomerModel from '~/modules/Customer/services/CustomerModels';
import { TextLeftAtom } from '~/components/atoms/TextAtom';
import { EditDateTimeOrganisms } from '~/components/organisms/EditDateTimeOrganisms/EditDateTimeOrganisms';

// style
import { GeneralViewStyle } from '~/styles/ViewStyle';
import { CustomerServices } from '~/modules/Customer/services/services/CustomerServices';
import { DEFAULT_PROFILE_PHOTO } from '~/util/Consts/ImageConst';
import dayjs from 'dayjs';
import { IMenuListItem } from '~/modules/Menu/MenuInterfaces';
import { selectedCustomer } from '~/redux/customer/actions';
import { CustomerListModalOrganisms } from '~/components/organisms/CustomerListModalOrganisms';

interface EditAppointmentProps {
  navigation: StackNavigationProp<MainStackNavParamList, 'EditAppointment'>;
  route: RouteProp<MainStackNavParamList, 'EditAppointment'>;
}

const EditAppointment: React.FC<EditAppointmentProps> = ({ navigation, route }) => {
  const item = route.params?.item;
  const userRedux = useAppSelector(state => state.user);
  const [memo, setMemo] = useState<string>('');
  const [startEndTime, setStartEndTime] = useState<ITimeValue>(
    item?.startEndtime || {
      startTime: '00:00',
      endTime: '00:00',
    },
  );
  const [date, setDate] = useState<IDateValue>(
    item?.date || {
      year: dayjs().format('YYYY'),
      month: dayjs().format('MM'),
      date: dayjs().format('DD'),
      dateString: dayjs().format('YYYY-MM-DD'),
    },
  );
  const [user, setUser] = useState<CustomerModel | null>(null);
  const [selectMenu, setSelectMenu] = useState<IMenuListItem[]>(
    item?.selectedMenuItems ? item.selectedMenuItems : [],
  );
  const [isVisibleCustomerList, setIsVisibleCustomerList] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const getSelectUser = async (customerId?: string) => {
      if (customerId) {
        const selectedUser = await CustomerServices.getCustomer(userRedux, customerId);
        if (selectedUser) {
          dispatch(selectedCustomer(selectedUser));
          setUser(selectedUser);
        }
      }
    };
    getSelectUser(item?.customerId);
  }, []);

  const _onPressSelectClient = () => {
    setIsVisibleCustomerList(true);
  };

  const _onPressSelectMenu = () => {
    console.log('onPressSelectMenu');
  };

  const _onChageMemo = (text: string) => {
    setMemo(text);
  };

  const _onPressDelete = () => {
    console.log('_onPressDelete');
  };

  const _onConfirmTimePicker = (timeValue: ITimeValue) => {
    console.log('timeValue', timeValue);
    setStartEndTime(timeValue);
  };

  const _onConfirmDatePicker = (dateValues: IDateValue) => {
    console.log('dateValues', dateValues);
  };

  const _onCloseCustomerList = () => {
    setIsVisibleCustomerList(false);
  };

  const _onSelectCustomer = (item: CustomerModel) => {
    setUser(item);
  };

  console.log('item', item);
  console.log('user', user);

  return (
    <ScrollView>
      <View style={GeneralViewStyle.bodyWrapper}>
        <TouchableOpacity style={styles.card} onPress={_onPressSelectClient}>
          {user ? (
            <>
              <Image
                source={user.profileImg ? { uri: `${user.profileImg}` } : DEFAULT_PROFILE_PHOTO}
                style={styles.userIcon}
              />
              <Text style={styles.selectClientText}>{`${user.firstName} ${user.lastName}`}</Text>
            </>
          ) : (
            <>
              <Image source={require('~assets/images/person1.png')} style={styles.userIcon} />
              <Text style={styles.selectClientText}>Select Client</Text>
            </>
          )}
        </TouchableOpacity>

        <EditDateTimeOrganisms
          container={styles.editDateTimeContiner}
          onConfirmDate={_onConfirmDatePicker}
          onConfirmTime={_onConfirmTimePicker}
          appointmentDate={date}
          startEndTime={startEndTime}
        />

        <ReportMenuList menuList={selectMenu} />
        <RoundButton onPress={_onPressSelectMenu} text={'Select Menu'} />
        <View style={styles.memo}>
          <TextLeftAtom>Memo</TextLeftAtom>
          <TextInput multiline style={styles.memoInput} onChangeText={_onChageMemo} value={memo} />
        </View>
        {user ? (
          <RoundButton
            onPress={_onPressDelete}
            text={'Delete Appointment'}
            style={styles.deleteButton}
            buttonColorType={IButtonColorType.Alert}
          />
        ) : null}
      </View>
      <CustomerListModalOrganisms
        isVisible={isVisibleCustomerList}
        onClose={_onCloseCustomerList}
        onSelect={_onSelectCustomer}
      />
    </ScrollView>
  );
};

const FAKE_MENU = [
  { id: '1', menuName: 'jel', price: '20', color: '#FF9F9F', amount: 2 },
  { id: '2', menuName: 'off', price: '30', color: '#87D1AA', amount: 1 },
  { id: '3', menuName: 'Design', price: '40', color: '#AC71D1', amount: 4 },
];

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: '4%',
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#e6e6e6',
    borderLeftColor: '#17906F',
    borderLeftWidth: 3,
  },
  userIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
  },
  selectClientText: {
    fontSize: 18,
  },
  editDateTimeContiner: {
    marginVertical: 30,
  },
  columnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginVertical: 12,
  },
  dateBlock: {
    marginVertical: 24,
  },
  textInput: {
    width: 200,
    borderBottomColor: '#9c9c9c',
    borderBottomWidth: 1,
  },
  memo: {
    marginVertical: 10,
  },
  memoInput: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#9c9c9c',
    borderRadius: 4,
    height: 200,
    paddingHorizontal: 10,
  },
  deleteButton: {
    marginBottom: 30,
  },
});

export default EditAppointment;
