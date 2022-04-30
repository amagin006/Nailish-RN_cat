import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ViewToken,
  Alert,
} from 'react-native';

// redux
import { useAppSelector } from '~/redux/hooks';

// navigation
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { MainStackNavParamList } from '~/route/types';

// components
import PagenationDot from '~/components/atoms/pagenation/pagenationDot';
import ReportMenuList from '~/components/organisms/ReportDetailOrganisms/ReportMenuList';
import PriceDetail from '~/components/organisms/ReportDetailOrganisms/PriceDetail';
import { LoadingIndicator, TextAtom } from '~/components/atoms';
import { IButtonColorType, RoundButton } from '~/components/atoms/button/button';
import { BioIcon } from '~/components/atoms/photoIcon/BioIcon';

// style
import { GeneralNavStyles, GeneralViewStyle } from '~/styles/ViewStyle';

// Type
import CustomerModel from '~/modules/Customer/services/CusomerModels';
import { IReportPhoto } from '~/modules/CustomerList/CustomerListInterfaces';

// Services
import { CustmerListServices } from '~/modules/CustomerList/services/CustomerListServices';
import { DEFAULT_PHOTO } from '~/util/Consts/ImageConst';

interface ReportDetailProps {
  navigation: StackNavigationProp<MainStackNavParamList, 'ReportDetail'>;
  route: RouteProp<MainStackNavParamList, 'ReportDetail'>;
}

const ReportDetail: React.FC<ReportDetailProps> = ({ navigation, route }) => {
  const { appointItem } = route.params;

  // Redux
  const userRedux = useAppSelector(state => state.user);
  const selectedCustomer: CustomerModel = useAppSelector(state => state.customer?.selectedCustomer);

  const { year, date, month } = appointItem.date;
  const { startTime, endTime } = appointItem.startEndtime;

  // State
  const [viewableItemIndex, setViewableItemIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity style={GeneralNavStyles.headerRight} onPress={_onEditReport}>
            <TextAtom style={GeneralNavStyles.headerRightText}>Edit</TextAtom>
          </TouchableOpacity>
        );
      },
    });
  }, [navigation]);

  const _renderPhoto = ({ item }: { item: IReportPhoto }) => {
    return <Image source={item.url ? { uri: item?.url } : DEFAULT_PHOTO} style={styles.photo} />;
  };

  const _keyExtractor = (item: IReportPhoto) => {
    return `${item.id}`;
  };

  const _onEditReport = () => {
    console.log('appino--------->>>', appointItem);
    navigation.navigate('NewReportAndEdit', { appointItem: appointItem });
  };

  const _onDeletePress = () => {
    Alert.alert('Are you sure you want to delete this report?', '', [
      { text: 'Cancel' },
      { text: 'OK', onPress: _deleteReport },
    ]);
  };

  const _deleteReport = async () => {
    // delete report
    setIsLoading(true);
    if (!appointItem.id) {
      Alert.alert('Something goes wrong. Try it later');
      return;
    }
    const isSuccess = await CustmerListServices.deleteReport(
      userRedux,
      selectedCustomer.id,
      appointItem.id,
    );
    if (!isSuccess) {
      Alert.alert('Something goes wrong. Try it later');
    }
    setIsLoading(false);
    navigation.navigate('ReportList', { reload: true });
  };

  const onViewRef = React.useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const newIndex = viewableItems[0]?.index;
    if (newIndex !== undefined && newIndex !== null) {
      setViewableItemIndex(newIndex);
    }
  });

  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <SafeAreaView>
      {isLoading && <LoadingIndicator isLoading={isLoading} />}
      <ScrollView>
        <View style={styles.userWrapper}>
          <BioIcon image={selectedCustomer.profileImg} style={styles.userIcon} />
          <View style={styles.nameWrapper}>
            <Text
              style={
                styles.name
              }>{`${selectedCustomer.firstName} ${selectedCustomer.lastName}`}</Text>
            <Text style={styles.date}>{`${year}/${month}/${date} ${startTime} ~ ${endTime}`}</Text>
          </View>
        </View>
        <FlatList<IReportPhoto>
          data={appointItem.photoUrls}
          horizontal={true}
          renderItem={_renderPhoto}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={_keyExtractor}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
        />
        <PagenationDot
          style={styles.pagenationDotStyle}
          foucsItemIndex={viewableItemIndex}
          list={appointItem.photoUrls}
        />
        <View style={GeneralViewStyle.bodyWrapper}>
          <ReportMenuList menuList={appointItem.selectedMenuItems} />
          <PriceDetail menuList={appointItem.selectedMenuItems} />
          <RoundButton
            onPress={_onDeletePress}
            text="Delete Report"
            style={styles.button}
            buttonColorType={IButtonColorType.Alert}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const width = Dimensions.get('screen').width;

const styles = StyleSheet.create({
  userIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userWrapper: {
    flexDirection: 'row',
    marginHorizontal: '3%',
    marginVertical: 8,
  },
  nameWrapper: {
    marginLeft: 20,
  },
  name: {
    paddingVertical: 6,
    fontWeight: 'bold',
  },
  date: {
    color: '#9c9c9c',
  },
  photo: {
    width: width,
    height: width,
  },
  pagenationDotStyle: {
    marginVertical: 20,
  },
  button: {
    marginTop: 30,
    marginBottom: 50,
  },
});

export default ReportDetail;
