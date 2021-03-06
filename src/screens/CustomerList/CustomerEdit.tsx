import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { Foundation } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';

// navigaiton
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { MainStackNavParamList } from '~/route/types';

// Redux
import { useAppSelector, useAppDispatch } from '~/redux/hooks';
import { addCustomerToList, deleteCustomer } from '~/redux/customer/actions';

// components
import { IButtonColorType, RoundButton } from '~/components/atoms/button/button';
import { LoadingIndicator } from '~/components/atoms';

// util, style
import { db } from '~/config/Firebase';
import CustomerModel from '~/modules/Customer/CustomerModels';
import { GeneralNavStyles } from '~/styles/ViewStyle';
import { CustomerServices } from '~/modules/Customer/services/CustomerServices';

interface CustomerEditProps {
  navigation: StackNavigationProp<MainStackNavParamList, 'CustomerEdit'>;
  route: RouteProp<MainStackNavParamList, 'CustomerEdit'>;
}

const CustomerEdit: React.FC<CustomerEditProps> = props => {
  const { navigation } = props;
  const [isNewCustomer, setIsNewCustomer] = useState<boolean>(true);
  const [firstName, setFirstName] = useState<string | undefined>();
  const [lastName, setLastName] = useState<string | undefined>('');
  const [mobile, setMobile] = useState<string | undefined>('');
  const [mail, setMail] = useState<string | undefined>('');
  const [instagram, setInstagram] = useState<string | undefined>('');
  const [twitter, setTwitter] = useState<string | undefined>('');
  const [birthday, setBirthDay] = useState<string | undefined>('');
  const [memo, setMemo] = useState<string | undefined>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customer, setCustomer] = useState<CustomerModel | undefined>();

  const userRedux = useAppSelector(state => state.user);
  const selectedCustmer: CustomerModel = useAppSelector(state => state.customer?.selectedCustomer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log('customer', selectedCustmer);
    const customer = selectedCustmer;
    if (customer) {
      setFirstName(customer.firstName);
      setLastName(customer.lastName);
      setMobile(customer.mobile);
      setMail(customer.mail);
      setInstagram(customer.instagram);
      setTwitter(customer.twitter);
      setBirthDay(customer.birthday);
      setMemo(customer.memo);
      setImageUrl(customer.profileImg);
      setCustomer(customer);
      setIsNewCustomer(false);
    }
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity onPress={_onSavePress} style={GeneralNavStyles.headerRight}>
            <Text style={GeneralNavStyles.headerRightText}>Save</Text>
          </TouchableOpacity>
        );
      },
    });
  }, [navigation, firstName, lastName, mobile, mail, instagram, twitter, birthday, memo, imageUrl]);

  const _onPressUser = () => {
    _getPermissionCameraRoll();
  };

  const _getPermissionCameraRoll = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
    _pickImage();
  };

  const _pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        setImageUrl(result.uri);
      }
    } catch (err) {
      console.log('Error getImagePicker: ', err);
    }
  };

  const _onSavePress = () => {
    if (!firstName) {
      Alert.alert('Please enter first Name');
      return;
    }
    uploadCustomerData();
  };

  const _onDelete = () => {
    Alert.alert('Are you sure you want to delete this customer?', '', [
      { text: 'Cancel' },
      { text: 'OK', onPress: _deleteCustomer },
    ]);
  };

  const _deleteCustomer = async () => {
    if (!customer) {
      Alert.alert('Something goes wrong. try it later');
      return;
    }
    const isSuccess = await CustomerServices.deleteCustomer(userRedux, customer.id);
    if (!isSuccess) {
      Alert.alert('Sorry, something goes wrong. try again');
    }
    dispatch(deleteCustomer(customer));
    navigation.popToTop();
  };

  const _upLoadImagePhoto = async (customerId: string): Promise<string | null> => {
    if (imageUrl) {
      setIsLoading(true);
      return await CustomerServices.upLoadImagePhoto(userRedux, customerId, imageUrl);
    }
    return null;
  };

  async function uploadCustomerData() {
    const firstLetter = firstName ? firstName.slice(0, 1) : '#';
    let updateCustomer = {
      id: '',
      firstLetter,
      firstName,
      lastName,
      birthday,
      mobile,
      mail,
      instagram,
      twitter,
      memo,
      profileImg: imageUrl,
    };

    let res;
    // new customer
    if (!customer) {
      try {
        res = await db
          .collection('users')
          .doc(`${userRedux.uid}`)
          .collection('customer')
          .add(updateCustomer);
        console.log('res.id', res.id);
      } catch (err) {
        props.navigation.pop();
        Alert.alert('Sorry, falied adding new customer. please try again.');
        console.log('Error firebase: ', err);
        throw Error('Failed adding new customer');
      }
      updateCustomer.id = res.id;
      updateCustomer.profileImg = await _upLoadImagePhoto(res.id);
      const newCustomerModel = new CustomerModel(updateCustomer);
      dispatch(addCustomerToList(newCustomerModel));
    } else {
      // update customer
      updateCustomer.profileImg = await _upLoadImagePhoto(customer.id);
      updateCustomer.id = customer.id;
    }
    await CustomerServices.updateCustomer(userRedux, updateCustomer);
    props.navigation.pop();
  }

  return (
    <KeyboardAwareScrollView extraScrollHeight={20} enableOnAndroid={true}>
      {isLoading && <LoadingIndicator isLoading={isLoading} />}

      <View style={styles.userIconHeader}>
        <TouchableOpacity onPress={_onPressUser}>
          <Image
            style={styles.userIconImage}
            source={
              imageUrl ? { uri: `${imageUrl}` } : require('../../../assets/images/person1.png')
            }
          />
          <View style={styles.cameraWrapper}>
            <Foundation style={styles.camera} name={'camera'} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.column}>
        <View style={styles.columnLeft}>
          <Image style={styles.columnIcon} source={require('../../../assets/images/person3.png')} />
          <Text>First Name</Text>
        </View>
        <TextInput
          style={styles.textInput}
          onChangeText={text => setFirstName(text)}
          value={firstName}
          placeholder="First Name"
        />
      </View>
      <View style={styles.column}>
        <View style={styles.columnLeft}>
          <Text style={styles.lastName}>Last Name</Text>
        </View>
        <TextInput
          style={styles.textInput}
          onChangeText={text => setLastName(text)}
          value={lastName}
          placeholder="Last Name"
        />
      </View>
      <View style={styles.column}>
        <View style={styles.columnLeft}>
          <Image style={styles.columnIcon} source={require('../../../assets/images/phone1.png')} />
          <Text>Mobile Number</Text>
        </View>
        <TextInput
          style={styles.textInput}
          onChangeText={text => setMobile(text)}
          keyboardType={'numeric'}
          value={mobile}
          placeholder="000-000-0000"
        />
      </View>
      <View style={styles.column}>
        <View style={styles.columnLeft}>
          <Image style={styles.columnIcon} source={require('../../../assets/images/mail1.png')} />
          <Text>Mail Address</Text>
        </View>
        <TextInput
          style={styles.textInput}
          keyboardType={'email-address'}
          onChangeText={text => setMail(text)}
          value={mail}
          placeholder="example@example.com"
        />
      </View>
      <View style={styles.column}>
        <View style={styles.columnLeft}>
          <Image
            style={styles.columnIcon}
            source={require('../../../assets/images/instagram2.png')}
          />
          <Text>Instagram</Text>
        </View>
        <TextInput
          style={styles.textInput}
          onChangeText={text => setInstagram(text)}
          value={instagram}
          placeholder="Instagram"
        />
      </View>
      <View style={styles.column}>
        <View style={styles.columnLeft}>
          <Image style={styles.columnIcon} source={require('../../../assets/images/twitter.png')} />
          <Text>Twitter</Text>
        </View>
        <TextInput
          style={styles.textInput}
          onChangeText={text => setTwitter(text)}
          value={twitter}
          placeholder="Twitter"
        />
      </View>
      <View style={styles.column}>
        <View style={styles.columnLeft}>
          <Image
            style={styles.columnIcon}
            source={require('../../../assets/images/birthday.png')}
          />
          <Text>Birth Day</Text>
        </View>
        <TextInput
          style={styles.textInput}
          onChangeText={text => setBirthDay(text)}
          value={birthday}
        />
      </View>
      <View style={styles.memo}>
        <Text>Memo</Text>
        <TextInput
          style={styles.memoTextInput}
          onChangeText={text => setMemo(text)}
          multiline
          numberOfLines={2}
          value={memo}
          placeholder="something..."
        />
      </View>
      {!isNewCustomer && (
        <View style={styles.deleteButton}>
          <RoundButton
            onPress={_onDelete}
            text={'Delete customer'}
            buttonColorType={IButtonColorType.Alert}
          />
        </View>
      )}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  userIconHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFEEAD',
  },
  userIconImage: {
    width: 180,
    height: 180,
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 90,
  },
  cameraWrapper: {
    position: 'absolute',
    bottom: -10,
    right: 4,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 3,
    width: 54,
    height: 54,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#E2E8ED',
  },
  camera: {
    color: '#589fed',
    fontSize: 30,
  },
  column: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8ED',
  },
  columnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 170,
    paddingHorizontal: '4%',
  },
  columnIcon: {
    width: 20,
    height: 20,
    marginRight: 14,
  },
  lastName: {
    marginLeft: 35,
  },
  textInput: {
    flex: 1,
    marginRight: 10,
  },
  memo: {
    paddingTop: 10,
    paddingBottom: 100,
    paddingHorizontal: '4%',
  },
  memoTextInput: {
    flex: 1,
    marginTop: 10,
  },
  deleteButton: {
    width: '80%',
    alignSelf: 'center',
    marginVertical: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8ED',
  },
});

export default CustomerEdit;
