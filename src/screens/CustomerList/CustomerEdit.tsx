/* eslint-disable react/display-name */
import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Foundation } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '~/redux/hooks';

import { RoundButton } from '../../components/button/button';
import { customerLoad } from '../../redux/customer/actions';
import firebase, { db } from '../../config/Firebase';
import { AppGeneralColor } from '~/styles/ColorStyle';
import CustomerModel from '~/modules/customer/services/cusomerModels';
import { MainStackNavParamList } from '~/route/types';

interface CustomerEditProps {
  navigation: StackNavigationProp<MainStackNavParamList, 'CustomerEdit'>;
  route: RouteProp<MainStackNavParamList, 'CustomerEdit'>;
}

const CustomerEdit: React.FC<CustomerEditProps> = props => {
  const { navigation } = props;
  const [firstName, setFirstName] = useState<string | undefined>();
  const [lastName, setLastName] = useState<string | undefined>('');
  const [mobile, setMobile] = useState<string | undefined>('');
  const [mail, setMail] = useState<string | undefined>('');
  const [instagram, setInstagram] = useState<string | undefined>('');
  const [twitter, setTwitter] = useState<string | undefined>('');
  const [birthday, setBirthDay] = useState<string | undefined>('');
  const [memo, setMemo] = useState<string | undefined>('');
  const [imageUrl, setImageUrl] = useState<string | undefined>('');
  const [progress, setProgress] = useState<number | undefined>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customer, setCustomer] = useState<CustomerModel | undefined>();

  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // const customer = props.navigation.getParam('item');
    const customer = props.route.params?.item;
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
    }
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity onPress={_onSavePress} style={styles.headerRightSave}>
            <Text style={styles.headerRightText}>Save</Text>
          </TouchableOpacity>
        );
      },
    });
  }, [navigation]);

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
    // _upLoadPhoto();
    uploadCustomerData();
  };

  const _onDelete = () => {
    Alert.alert('Are you sure you want to delete this customer?', '', [
      { text: 'Cancel' },
      { text: 'OK', onPress: _deleteCustomer },
    ]);
  };

  const _deleteCustomer = async () => {
    if (!customer?.id) {
      console.log('Error delete customer is undifined');
      return;
    }
    try {
      await db
        .collection('users')
        .doc(`${user.uid}`)
        .collection('customer')
        .doc(`${customer.id}`)
        .delete();
      console.log('Document successfully deleted! customerId', customer.id);
      navigation.popToTop();
    } catch (err) {
      console.log('Error delete customer: ', err);
    }
  };

  const _upLoadPhoto = async customerId => {
    // import ImageResizer from 'react-native-image-resizer';
    // todo: it's better to resize before upload image
    setIsLoading(true);
    const metadata = {
      contentType: 'image/jpeg',
    };
    const storage = firebase.storage();
    if (!imageUrl) {
      console.log('Error imageUri is undifined', imageUrl);
      return;
    }
    const imgURI = imageUrl;
    let blob;
    let downloadURL;
    try {
      const response = await fetch(imgURI);
      console.log('responese', response);
      blob = await response.blob();
    } catch (err) {
      console.log('Error to blob: ', err);
    }
    const uploadRef = storage.ref('user').child(`${user.uid}/customers/${customerId}/profile_img`);
    const uploadTask = uploadRef.put(blob, metadata);
    uploadTask.on(
      'state_changed',
      snapshot => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
        console.log('progress');
      },
      err => {
        console.log('Error upload: ', err);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then(URL => {
          // uploadCustomerData(downloadURL);
          console.log('File available at', URL);
          downloadURL = URL;
        });
      },
    );
    return downloadURL;
  };

  async function uploadCustomerData() {
    const firstLetter = firstName ? firstName.slice(0, 1) : '#';
    let updateCustomer = {
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
          .doc(`${user.uid}`)
          .collection('customer')
          .add(updateCustomer);
        console.log('res.id', res.id);
      } catch (err) {
        console.log('Error firebase: ', err);
      }
      updateCustomer.profileImg = await _upLoadPhoto(res.id);
    }

    if (imageUrl && !imageUrl.indexOf('https://')) {
      console.log('not imageURL https://');
      updateCustomer.profileImg = await _upLoadPhoto(customer?.id);
    }

    // It doesn't wait  => I have to figure out way to update after upload image
    const customerRef = db
      .collection('users')
      .doc(`${user.uid}`)
      .collection('customer')
      .doc(`${res.id}`);
    try {
      await customerRef.update(updateCustomer);
    } catch (err) {
      console.log('Error update image', err);
    }

    dispatch(customerLoad(true));
    props.navigation.pop();
    setIsLoading(true);
  }

  return (
    <KeyboardAwareScrollView extraScrollHeight={20} enableOnAndroid={true}>
      {isLoading && (
        <Modal animationType="fade" transparent={true} visible={isLoading}>
          <View
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size={'large'} color={'#'} />
          </View>
        </Modal>
      )}
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
      {customer && (
        <View style={styles.deleteButton}>
          <RoundButton onPress={_onDelete} text={'Delete customer'} style={styles.roundButton} />
        </View>
      )}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  headerRightSave: {
    marginRight: 20,
  },
  headerRightText: {
    color: '#fff',
    fontSize: 16,
  },
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
    paddingBottom: 20,
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
  roundButton: {
    backgroundColor: AppGeneralColor.Palette.Alert,
  },
});

export default CustomerEdit;
