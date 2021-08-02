import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
// import RNPickerSelect from 'react-native-picker-select';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

// navigation
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackNavParamList } from '~/route/types';

import { RoundButton } from '~/components/atoms/button/button';
import ReportMenuList from '~/components/molecules/reportDetail/ReportMenuList';
import { GeneralNavStyles, GeneralViewStyle } from '~/styles/ViewStyle';
import { ListAddFloatButton } from '~/components/atoms/button/ListAddFloatButton';
import { AppGeneralColor } from '~/styles/ColorStyle';
import { TextLeftAtom } from '~/components/atoms/TextAtom';
import { EditDateTimeOrganisms } from '~/components/organisms/editDateTimeOrganisms/EditDateTimeOrganisms';
import { IDateValue } from '~/components/molecules/editDateTimeMolecules/EditDateMolecules';
import { ITimeValue } from '~/components/molecules/editDateTimeMolecules/EditTimeMolecules';
import { PaymentCoulmnMolecules } from '~/components/molecules/columnMolecules/PaymentCoulmnMolecules';
import { IPickerItem } from '~/components/atoms/PickerModalAtom';

interface ReportEditProps {
  navigation: StackNavigationProp<MainStackNavParamList, 'ReportEdit'>;
}

const ReportEdit: React.FC<ReportEditProps> = ({ navigation }) => {
  const [hasPermissionCameraRoll, setHasPermissionCameraRoll] = useState(false);
  const [reportPhotos, setReportPhotos] = useState(DEFAULTPHOTOS);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [tips, setTips] = useState();
  const [payment, setPayment] = useState();
  const [memo, setMemo] = useState();

  useLayoutEffect(() => {
    navigation.setOptions({
      // TODO: change title new report or edit report
      title: 'Edit Report',
      headerRight: () => {
        return (
          <TouchableOpacity
            style={GeneralNavStyles.headerRight}
            onPress={() => console.log('onPress Saved')}>
            <Text style={GeneralNavStyles.headerRightText}>Save</Text>
          </TouchableOpacity>
        );
      },
    });
  }, []);

  const _onPressSelectMenu = () => {
    navigation.navigate('SelectMenuList');
  };

  const _onChangeTips = text => {
    setTips(text);
  };

  const _onChangePayment = item => {
    setPayment(item);
  };

  const _onChageMemo = text => {
    setMemo(text);
  };

  const _onConfirmDate = (dateValues: IDateValue) => {
    console.log('dateValues', dateValues);
  };

  const _onConfirmTime = (timeValues: ITimeValue) => {
    console.log('timeValues', timeValues);
  };

  const _onConfirmPayment = (id: number) => {
    console.log(
      '_onConfirmPayment',
      PAYMENT.filter(p => p.id === id),
    );
  };

  const _getPermissionCameraRoll = async () => {
    if (!hasPermissionCameraRoll) {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Sorry, we need camera roll permissions to make this work!');
          return;
        }
        setHasPermissionCameraRoll(true);
      }
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        let newReportPhotos = [...reportPhotos];
        newReportPhotos[selectedPhotoIndex].url = result.uri;
        setReportPhotos(newReportPhotos);
      }
    } catch (err) {
      console.log('Error getImagePicker: ', err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View>
          <Image
            source={{ uri: `${reportPhotos[selectedPhotoIndex].url}` }}
            style={styles.mainPhoto}
          />
          <ListAddFloatButton
            onPress={_getPermissionCameraRoll}
            style={styles.addButton}
            iconStyle={styles.addIcon}
          />
        </View>
        <View style={styles.subImageWrapper}>
          {reportPhotos.map((photo, index) => {
            return (
              <TouchableOpacity
                onPress={() => setSelectedPhotoIndex(index)}
                key={`${index}`}
                style={styles.subImageBox}>
                <Image source={{ uri: `${photo.url}` }} style={styles.subImage} />
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={GeneralViewStyle.bodyWrapper}>
          <EditDateTimeOrganisms
            container={styles.editDateTimeContainer}
            onConfirmTime={_onConfirmTime}
            onConfirmDate={_onConfirmDate}
          />

          <ReportMenuList menuList={FAKE_MENU} />
          <RoundButton
            onPress={_onPressSelectMenu}
            text={'Select Menu'}
            style={styles.selectButton}
          />
          <View style={styles.columnWrapper}>
            <TextLeftAtom>Tips</TextLeftAtom>
            <View style={styles.tips}>
              <Text style={styles.dollerMark}>$</Text>
              <TextInput
                placeholder="0.00"
                keyboardType={'number-pad'}
                style={styles.tipTextInput}
                value={tips}
                onChangeText={_onChangeTips}
              />
            </View>
          </View>

          <PaymentCoulmnMolecules
            options={PAYMENT}
            onConfirm={_onConfirmPayment}
            container={styles.paymentPickerContainer}
          />

          <View style={styles.memo}>
            <TextLeftAtom>Memo</TextLeftAtom>
            <TextInput
              multiline
              style={styles.memoInput}
              onChangeText={_onChageMemo}
              value={memo}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const DEFAULTPHOTOS = [
  {
    id: '1',
    url: 'https://storage.googleapis.com/nailish-firebase.appspot.com/temp/imagePlaceholder.png',
  },
  {
    id: '2',
    url: 'https://storage.googleapis.com/nailish-firebase.appspot.com/temp/imagePlaceholder.png',
  },
  {
    id: '3',
    url: 'https://storage.googleapis.com/nailish-firebase.appspot.com/temp/imagePlaceholder.png',
  },
  {
    id: '4',
    url: 'https://storage.googleapis.com/nailish-firebase.appspot.com/temp/imagePlaceholder.png',
  },
];

const PAYMENT: IPickerItem[] = [
  { id: 1, label: 'Credit Card', value: 'creditCard' },
  { id: 2, label: 'Cash', value: 'cash' },
];

const width = Dimensions.get('screen').width;
const subImageSize = width * 0.2;
const styles = StyleSheet.create({
  mainPhoto: {
    width: width,
    height: width,
    marginBottom: 18,
  },
  subImageWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '5%',
  },
  subImageBox: {
    borderRadius: 10,
  },
  subImage: {
    borderRadius: 10,
    width: subImageSize,
    height: subImageSize,
    resizeMode: 'contain',
    borderColor: AppGeneralColor.Palette.BorderGray,
    borderWidth: 1,
  },
  columnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginVertical: 12,
  },
  editDateTimeContainer: {
    marginVertical: 30,
  },
  paymentPickerContainer: {
    marginVertical: 12,
  },
  textInput: {
    width: 200,
    borderBottomColor: '#9c9c9c',
    borderBottomWidth: 1,
  },
  selectButton: {
    marginVertical: 10,
  },
  tips: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  tipTextInput: {
    width: 100,
    borderBottomColor: '#9c9c9c',
    borderBottomWidth: 1,
    textAlign: 'right',
    fontSize: 16,
  },
  dollerMark: {
    marginRight: 10,
  },
  paymentSelct: {
    width: 130,
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
  addButton: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    width: 50,
    height: 50,
    paddingTop: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#D9534F',
  },
  addIcon: {
    fontSize: 36,
    color: '#fff',
  },
});

export default ReportEdit;

const FAKE_MENU = [
  { menuItem: 'jel', price: '20', bgcolor: '#FF9F9F' },
  { menuItem: 'off', price: '30', bgcolor: '#87D1AA' },
  { menuItem: 'Design', price: '40', bgcolor: '#AC71D1' },
];
