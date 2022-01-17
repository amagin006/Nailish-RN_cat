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
} from 'react-native';
import dayjs from 'dayjs';

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
import { TextAtom } from '~/components/atoms';
import { IButtonColorType, RoundButton } from '~/components/atoms/button/button';

// style
import { GeneralNavStyles, GeneralViewStyle } from '~/styles/ViewStyle';
import { BioIcon } from '~/components/atoms/photoIcon/BioIcon';
import CustomerModel from '~/modules/Customer/services/CusomerModels';
import { ICustomerReport, IReportPhoto } from '~/modules/CustomerList/CustomerListInterfaces';

interface ReportDetailProps {
  navigation: StackNavigationProp<MainStackNavParamList, 'ReportDetail'>;
  route: RouteProp<MainStackNavParamList, 'ReportDetail'>;
}

const ReportDetail: React.FC<ReportDetailProps> = ({ navigation, route }) => {
  const { appointItem } = route.params;
  const selectedCustomer: CustomerModel = useAppSelector(state => state.customer?.selectedCustomer);

  const date = dayjs(appointItem.appointmentStart).format('YYYY/MM/DD');
  const startTime = dayjs(appointItem.appointmentStart).format('HH:mm');
  const endTime = dayjs(appointItem.appointmentEnd).format('HH:mm');

  const [viewableItemIndex, setViewableItemIndex] = useState(0);

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
    return <Image source={{ uri: item?.url }} style={styles.photo} />;
  };

  const _keyExtractor = (item: IReportPhoto) => {
    return `${item.id}`;
  };

  const _onEditReport = () => {
    navigation.navigate('NewReportAndEdit');
  };

  const _onDeletePress = () => {
    console.log('========_onDeletePress========');
  };

  const onViewRef = React.useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    console.log('========onViewRef========', viewableItems);
    viewableItems[0]?.index && setViewableItemIndex(viewableItems[0].index);
  });

  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.userWrapper}>
          <BioIcon image={selectedCustomer.profileImg} style={styles.userIcon} />
          <View style={styles.nameWrapper}>
            <Text
              style={
                styles.name
              }>{`${selectedCustomer.firstName} ${selectedCustomer.lastName}`}</Text>
            <Text style={styles.date}>{`${date} ${startTime} ~ ${endTime}`}</Text>
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
