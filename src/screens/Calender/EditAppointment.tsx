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
import { selectedCustomer } from '~/redux/customer/actions';
import { useAppDispatch } from '~/redux/hooks';

// component
import { RoundButton } from '~/components/molecules/button/button';
import ReportMenuList from '~/components/organisms/reportDetail/ReportMenuList';

// style
import { AppGeneralColor } from '~/styles/ColorStyle';
import { GeneralViewStyle } from '~/styles/ViewStyle';
import CustomerModel from '~/modules/customer/services/cusomerModels';
import { TextLeftAtom } from '~/components/atoms/TextAtom';

interface EditAppointmentProps {
  navigation: StackNavigationProp<MainStackNavParamList, 'EditAppointment'>;
  route: RouteProp<MainStackNavParamList, 'EditAppointment'>;
}

const EditAppointment: React.FC<EditAppointmentProps> = ({ navigation, route }) => {
  const [memo, setMemo] = useState<string>('');
  const [user, setUser] = useState<CustomerModel>(route.params?.item?.user);

  const dispatch = useAppDispatch();

  useEffect(() => {
    setUser(user);
  }, []);

  const _onPressSelectClient = () => {
    console.log('_onPressSelectClient', user);
    dispatch(selectedCustomer(user));
    navigation.navigate('CustomerEdit');
  };

  const _onPressSelectMenu = () => {
    console.log('onPressSelectMenu');
  };

  const _onChageMemo = text => {
    setMemo(text);
  };

  const _onPressDelete = () => {
    console.log('_onPressDelete');
  };

  return (
    <ScrollView>
      <View style={GeneralViewStyle.bodyWrapper}>
        <TouchableOpacity style={styles.card} onPress={_onPressSelectClient}>
          {user ? (
            <>
              <Image source={{ uri: `${user.profileImg}` }} style={styles.userIcon} />
              <Text style={styles.selectClientText}>{`${user.firstName} ${user.lastName}`}</Text>
            </>
          ) : (
            <>
              <Image source={require('~assets/images/person1.png')} style={styles.userIcon} />
              <Text style={styles.selectClientText}>Select Client</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.dateBlock}>
          <View style={styles.columnWrapper}>
            <TextLeftAtom>Visit Date</TextLeftAtom>
            <TextInput style={styles.textInput} />
          </View>
          <View style={styles.columnWrapper}>
            <TextLeftAtom> Start Time</TextLeftAtom>
            <TextInput style={styles.textInput} />
          </View>
          <View style={styles.columnWrapper}>
            <TextLeftAtom>End Time</TextLeftAtom>
            <TextInput style={styles.textInput} />
          </View>
        </View>
        <ReportMenuList menuList={FAKE_MENU} />
        <RoundButton onPress={_onPressSelectMenu} text={'Select Menu'} />
        <View style={styles.memo}>
          <TextLeftAtom>Memo</TextLeftAtom>
          <TextInput multiline style={styles.memoInput} onChangeText={_onChageMemo} value={memo} />
        </View>
        {user && (
          <RoundButton
            onPress={_onPressDelete}
            text={'Delete Appointment'}
            style={styles.deleteButton}
          />
        )}
      </View>
    </ScrollView>
  );
};

const FAKE_MENU = [
  { menuItem: 'jel', price: '20', bgcolor: '#FF9F9F' },
  { menuItem: 'off', price: '30', bgcolor: '#87D1AA' },
  { menuItem: 'Design', price: '40', bgcolor: '#AC71D1' },
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
    backgroundColor: AppGeneralColor.Palette.Alert,
    marginBottom: 30,
  },
});

export default EditAppointment;
