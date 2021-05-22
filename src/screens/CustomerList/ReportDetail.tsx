import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import dayjs from 'dayjs';

// navigation
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { MainStackNavParamList } from '~/route/types';

// components
import PagenationDot from '~/components/molecules/pagenation/pagenationDot';
import ReportMenuList from '~/components/organisms/reportDetail/ReportMenuList';
import PriceDetail from '~/components/organisms/reportDetail/PriceDetail';
import { RoundButton } from '~/components/molecules/button/button';

// style
import { GeneralViewStyle } from '~/styles/ViewStyle';
import { AppGeneralColor } from '~/styles/ColorStyle';
import { useAppSelector } from '~/redux/hooks';
import { BioIcon } from '~/components/molecules/photoIcon/BioIcon';
import CustomerModel from '~/modules/customer/services/cusomerModels';

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

  const _renderPhoto = item => <Image source={{ uri: `${item.item.url}` }} style={styles.photo} />;
  const _keyExtractor = item => `${item.id}`;

  const _onDeletePress = () => {
    console.log('========_onDeletePress========');
  };

  const onViewRef = React.useRef(({ viewableItems }) => {
    setViewableItemIndex(viewableItems[0].index);
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
        <FlatList
          data={appointItem.photo}
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
          list={appointItem.photo}
        />
        <View style={GeneralViewStyle.bodyWrapper}>
          <ReportMenuList menuList={appointItem.menu} />
          <PriceDetail menuList={appointItem.menu} />
          <RoundButton onPress={_onDeletePress} text="delete" style={styles.button} />
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
    backgroundColor: AppGeneralColor.Palette.Alert,
  },
});

export default ReportDetail;
