import React, { ReactNode, useCallback, useEffect, useLayoutEffect, useState } from 'react';
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
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import dayjs from 'dayjs';

// navigation
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackNavParamList } from '~/route/types';
import { RouteProp } from '@react-navigation/core';

// components
import { IButtonColorType, RoundButton } from '~/components/atoms/button/button';
import ReportMenuList from '~/components/organisms/ReportDetailOrganisms/ReportMenuList';
import { ListAddFloatButton } from '~/components/atoms/button/ListAddFloatButton';
import { TextLeftAtom } from '~/components/atoms/TextAtom';
import { EditDateTimeOrganisms } from '~/components/organisms/EditDateTimeOrganisms/EditDateTimeOrganisms';
import { IDateValue } from '~/components/molecules/EditDateTimeMolecules/EditDateMolecules';
import { ITimeValue } from '~/components/molecules/EditDateTimeMolecules/EditTimeMolecules';
import { PaymentCoulmnMolecules } from '~/components/molecules/ColumnMolecules/PaymentCoulmnMolecules';
import { IPickerItem } from '~/components/atoms/PickerModalAtom';

// styles
import { GeneralViewStyle } from '~/styles/ViewStyle';
import { AppGeneralColor } from '~/styles/ColorStyle';
import { IMenuListItem } from '~/modules/Menu/MenuInterfaces';

interface ReportEditProps {
  navigation: StackNavigationProp<MainStackNavParamList, 'ReportEdit'>;
  route: RouteProp<MainStackNavParamList, 'ReportEdit'>;
}

interface IReportPhoto {
  id: string | null;
  url: string;
}

const ReportEdit: React.FC<ReportEditProps> = ({ navigation, route }) => {
  const [hasPermissionCameraRoll, setHasPermissionCameraRoll] = useState<boolean>(false);
  const [reportPhotos, setReportPhotos] = useState<IReportPhoto[]>([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [date, setDate] = useState<IDateValue>({
    year: dayjs().format('YYYY'),
    month: dayjs().format('MM'),
    date: dayjs().format('DD'),
  });
  const [startEndtime, setStartEndTime] = useState<ITimeValue>({
    startTime: '00:00',
    endTime: '00:00',
  });
  const [selectedMenuItems, setSelectedMenuItems] = useState<IMenuListItem[]>([]);
  const [tips, setTips] = useState<string>('');
  const [payment, setPayment] = useState<IPickerItem>(PAYMENT[0]);
  const [memo, setMemo] = useState<string>('');

  useLayoutEffect(() => {
    console.log('route.params?.newReport', route.params?.newReport);
    const titleStr = route.params?.newReport ? 'New Report' : 'Edit Report';
    navigation.setOptions({
      title: titleStr,
    });
  }, []);

  useEffect(() => {
    _makePhotoArray();
    const menuItems = route.params?.selectedMenuItems ?? [];
    setSelectedMenuItems(menuItems);
  }, [route.params?.selectedMenuItems]);

  const _makePhotoArray = useCallback(() => {
    let newReportPhoto: IReportPhoto[] = [];
    for (let i = 0; i < 4; i++) {
      const reportPhoto = {
        id: reportPhotos[i] ? reportPhotos[i].id : null,
        url: reportPhotos[i]
          ? reportPhotos[i].url
          : 'https://storage.googleapis.com/nailish-firebase.appspot.com/temp/imagePlaceholder.png',
      };
      newReportPhoto.push(reportPhoto);
    }
    setReportPhotos(newReportPhoto);
  }, []);

  const _onPressSelectMenu = () => {
    navigation.navigate('SelectMenuListScreen');
  };

  const _onChangeTips = (text: string) => {
    setTips(text);
  };

  const _onChageMemo = (text: string) => {
    setMemo(text);
  };

  const _onConfirmDate = (dateValues: IDateValue) => {
    setDate(dateValues);
    console.log('dateValues', dateValues);
  };

  const _onConfirmTime = (timeValues: ITimeValue) => {
    console.log('timeValues', timeValues);
    setStartEndTime(timeValues);
  };

  const _onConfirmPayment = (id: number) => {
    const payItem = PAYMENT.find(p => p.id === id);
    if (payItem) {
      setPayment(payItem);
    }
  };

  const _onPressSaveButton = () => {
    const saveData = {
      date,
      startEndtime,
      selectedMenuItems,
      tips,
      payment,
      memo,
    };
    console.log('save reportPhotos', reportPhotos);
    console.log('save Report', saveData);
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
        quality: 0.6,
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
            source={{ uri: `${reportPhotos[selectedPhotoIndex]?.url}` }}
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
            console.log('0000000000000', photo);
            console.log('0000000000000index', index);
            return (
              <TouchableOpacity
                onPress={() => setSelectedPhotoIndex(index)}
                key={`${index}`}
                style={styles.subImageBox}>
                <Image source={{ uri: `${photo?.url}` }} style={styles.subImage} />
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={GeneralViewStyle.bodyWrapper}>
          <EditDateTimeOrganisms
            container={styles.editDateTimeContainer}
            onConfirmTime={_onConfirmTime}
            onConfirmDate={_onConfirmDate}
            startEndTime={startEndtime}
          />

          <ReportMenuList menuList={selectedMenuItems} />
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
          <RoundButton
            onPress={_onPressSaveButton}
            text={'Save Report'}
            style={styles.saveButton}
            buttonColorType={IButtonColorType.Confirm}
          />
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
  saveButton: {
    backgroundColor: AppGeneralColor.Button.Confirm,
  },
});

export default ReportEdit;

const FAKE_MENU: IMenuListItem[] = [
  { id: '1', menuName: 'jel', price: '20', color: '#FF9F9F', amount: 2 },
  { id: '2', menuName: 'off', price: '30', color: '#87D1AA', amount: 1 },
  { id: '3', menuName: 'Design', price: '40', color: '#AC71D1', amount: 20 },
];
