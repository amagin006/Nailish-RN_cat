import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
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
import { TextLeftAtom, TextAtom } from '~/components/atoms/TextAtom';
import { EditDateTimeOrganisms } from '~/components/organisms/EditDateTimeOrganisms/EditDateTimeOrganisms';
import { PaymentCoulmnMolecules } from '~/components/molecules/ColumnMolecules/PaymentCoulmnMolecules';
import { IPickerItem } from '~/components/atoms/PickerModalAtom';
import { LoadingIndicator } from '~/components/atoms';

// Type
import { IDateValue } from '~/components/molecules/EditDateTimeMolecules/EditDateMolecules';
import { ITimeValue } from '~/components/molecules/EditDateTimeMolecules/EditTimeMolecules';
import { ICustomerReport, IReportPhoto } from '~/modules/Customer/CustomerListInterfaces';

// styles
import { GeneralViewStyle } from '~/styles/ViewStyle';
import { AppGeneralColor } from '~/styles/ColorStyle';
import { IMenuListItem } from '~/modules/Menu/MenuInterfaces';

// Services
import { CustomerServices } from '~/modules/Customer/services/CustomerServices';

// Redux
import { useAppSelector } from '~/redux/hooks';
import { generalTextStyles } from '~/styles/TextStyle';
import { inputPriceConvert, priceFormat } from '~/util/numberUtil';

interface NewReportAndEditProps {
  navigation: StackNavigationProp<MainStackNavParamList, 'NewReportAndEdit'>;
  route: RouteProp<MainStackNavParamList, 'NewReportAndEdit'>;
}

const NewReportAndEdit: React.FC<NewReportAndEditProps> = ({ navigation, route }) => {
  // Redux
  const userRedux = useAppSelector(state => state.user);
  const customerRedux = useAppSelector(state => state.customer?.selectedCustomer);

  const [hasPermissionCameraRoll, setHasPermissionCameraRoll] = useState<boolean>(false);
  const [reportPhotos, setReportPhotos] = useState<IReportPhoto[]>([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [date, setDate] = useState<IDateValue>({
    year: dayjs().format('YYYY'),
    month: dayjs().format('MM'),
    date: dayjs().format('DD'),
    dateString: dayjs().format('YYYY-MM-DD'),
  });
  const [startEndtime, setStartEndtime] = useState<ITimeValue>({
    startTime: '00:00',
    endTime: '00:00',
  });
  const [selectedMenuItems, setSelectedMenuItems] = useState<IMenuListItem[]>([]);
  const [tips, setTips] = useState<string>('');
  const [payment, setPayment] = useState<IPickerItem>(PAYMENT[0]);
  const [memo, setMemo] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const appointItem = route.params?.appointItem;

  useLayoutEffect(() => {
    const titleStr = appointItem ? 'Edit Report' : 'New Report';
    let photoUrlsArr: IReportPhoto[] = [];
    if (appointItem) {
      setDate(appointItem.date);
      setStartEndtime(appointItem.startEndtime);
      setSelectedMenuItems(appointItem.selectedMenuItems);
      setTips(appointItem.tips);
      setPayment(appointItem.payment);
      setReportPhotos(appointItem.photoUrls);
      photoUrlsArr = appointItem.photoUrls;
    }
    _makePhotoArray(photoUrlsArr); // Create Initial photo Array
    navigation.setOptions({
      title: titleStr,
    });
  }, []);

  useEffect(() => {
    const menuItems = route.params?.selectedMenuItems ?? [];
    setSelectedMenuItems(menuItems);
  }, [route.params?.selectedMenuItems]);

  const _makePhotoArray = useCallback((photoUrls: IReportPhoto[]) => {
    let newReportPhoto: IReportPhoto[] = [];
    for (let i = 0; i < 4; i++) {
      const reportPhoto = {
        id: photoUrls && photoUrls[i] ? photoUrls[i].id : i,
        url: photoUrls && photoUrls[i] ? photoUrls[i].url : null,
      };
      newReportPhoto.push(reportPhoto);
    }
    setReportPhotos(newReportPhoto);
  }, []);

  // go to select Menu screen
  const _onPressSelectMenu = () => {
    navigation.navigate('SelectMenuListScreen');
  };

  const _onChangeTips = (text: string) => {
    console.log('text tip', text);
    setTips(inputPriceConvert(text));
  };

  const _onChageMemo = (text: string) => {
    setMemo(text);
  };

  const _onConfirmDate = (dateValues: IDateValue) => {
    setDate(dateValues);
    console.log('dateValues', dateValues);
  };

  const _onConfirmTime = (timeValues: ITimeValue) => {
    setStartEndtime(timeValues);
  };

  const _onConfirmPayment = (id: number) => {
    const payItem = PAYMENT.find(p => p.id === id);
    if (payItem) {
      setPayment(payItem);
    }
  };

  const _onPressSaveButton = async () => {
    setIsLoading(true);

    if (appointItem && appointItem.id) {
      // Update report
      // Check if report photo is needed update on fire storage
      const needUpdatePhoto = reportPhotos.some(photo => {
        return photo.url !== null && !photo.url?.startsWith('http');
      });

      let updatePhotoUrls = [...reportPhotos];
      if (needUpdatePhoto) {
        // Upload photo and get url from firebase storage
        updatePhotoUrls = await CustomerServices.getUploadReportPhotoUrls(
          userRedux,
          customerRedux.id,
          reportPhotos,
          appointItem.id,
        );
      }
      _saveReport(appointItem.id, updatePhotoUrls);
    } else {
      // New report create
      // Get new Report key on firebase
      const reportId = await CustomerServices.getNewReportKey(userRedux, customerRedux.id);
      // Upload photo and get url from firebase storage
      const photoUrls = await CustomerServices.getUploadReportPhotoUrls(
        userRedux,
        customerRedux.id,
        reportPhotos,
        reportId,
      );
      _saveReport(reportId, photoUrls);
    }
  };

  // To save report to firebase DB either new report or update
  const _saveReport = async (reportId: string, updatePhotoUrls: IReportPhoto[]) => {
    const saveData: ICustomerReport = {
      id: reportId,
      photoUrls: updatePhotoUrls,
      date,
      startEndtime,
      selectedMenuItems,
      tips,
      payment,
      memo,
      customerId: customerRedux.id,
      customerFirstName: customerRedux.firstName,
      customerLastName: customerRedux.lastName,
    };

    // save to firebase
    const resNewReport = await CustomerServices.setNewReport(
      userRedux,
      customerRedux.id,
      reportId,
      saveData,
    );
    if (!resNewReport) {
      Alert.alert('Sorry, something went wrong. Try it later...');
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    navigation.navigate('ReportList', { reload: true });
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
        newReportPhotos[selectedPhotoIndex].id = selectedPhotoIndex;
        setReportPhotos(newReportPhotos);
      }
    } catch (err) {
      console.log('Error getImagePicker: ', err);
    }
  };

  const priceArr: number[] = selectedMenuItems.map(item => Number(item.price));
  const menuTotalPrice: number = priceArr.reduce((prev, curr) => prev + curr, 0);
  const totalPrice = priceFormat(menuTotalPrice + Number(tips));

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoading && <LoadingIndicator isLoading={isLoading} />}
      <ScrollView>
        <View>
          <Image
            source={
              reportPhotos[selectedPhotoIndex]?.url
                ? { uri: `${reportPhotos[selectedPhotoIndex]?.url}` }
                : require('../../../assets/images/imagePlaceholder.png')
            }
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
                style={[
                  styles.subImageBox,
                  selectedPhotoIndex === index && styles.subImageBoxSelected,
                ]}>
                <Image
                  source={
                    photo?.url
                      ? { uri: `${photo?.url}` }
                      : require('../../../assets/images/imagePlaceholder.png')
                  }
                  style={styles.subImage}
                />
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
            appointmentDate={date}
          />

          <RoundButton
            onPress={_onPressSelectMenu}
            text={'Add Menu'}
            containerStyle={styles.selectButton}
          />
          <ReportMenuList menuList={selectedMenuItems} />
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
                maxLength={8}
              />
            </View>
          </View>
          <View style={styles.columnWrapper}>
            <TextLeftAtom>Total</TextLeftAtom>
            <Text style={styles.Total}>{`$ ${totalPrice}`}</Text>
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
  subImageBoxSelected: {
    borderColor: AppGeneralColor.Button.Alert,
    borderWidth: 1,
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
    alignSelf: 'flex-end',
    width: 120,
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
  Total: {
    ...generalTextStyles.boldLittleMediumText,
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

export default NewReportAndEdit;
