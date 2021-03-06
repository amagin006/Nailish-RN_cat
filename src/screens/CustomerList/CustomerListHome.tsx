import React, { useCallback, useEffect, useState } from 'react';
import {
  SectionList,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { TextAtom } from '~/components/atoms/TextAtom';

// navigation
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  MainStackNavParamList,
  BottomTabNavParamList,
  CustomerListStackNavParamsList,
} from '~/route/types';

// redux
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { saveCustomerList, selectedCustomer } from '~/redux/customer/actions';

// component
import { ListAddFloatButton } from '~/components/atoms/button/ListAddFloatButton';

// util
import CustomerModel from '~/modules/Customer/CustomerModels';
import { BioIcon } from '~/components/atoms/photoIcon/BioIcon';
import { ActivityIndicatorAtom } from '~/components/atoms';
import { generalTextStyles } from '~/styles/TextStyle';
import { AppGeneralColor } from '~/styles/ColorStyle';
import { CustomerServices } from '~/modules/Customer/services/CustomerServices';

interface ICustomerListItem {
  initial?: string;
  data: CustomerModel[];
}

type CustomerListNavProps = CompositeNavigationProp<
  StackNavigationProp<MainStackNavParamList, 'BottomNav'>,
  CompositeNavigationProp<
    BottomTabNavigationProp<BottomTabNavParamList, 'CustomerList'>,
    StackNavigationProp<CustomerListStackNavParamsList, 'CustomerListHome'>
  >
>;

interface CustomerListHomeProps {
  navigation: CustomerListNavProps;
}

const CustomerListHome: React.FC<CustomerListHomeProps> = ({ navigation }) => {
  const [isInitial, setIsInitial] = useState<boolean>(true);
  const [customerList, setCustomerList] = useState<ICustomerListItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const userRedux = useAppSelector(state => state.user);
  const customerRedux = useAppSelector(state => state.customer);
  const dispatch = useAppDispatch();

  // Initialized
  useEffect(() => {
    getCustomerList().then(() => {
      setIsInitial(false);
    });
  }, []);

  useEffect(() => {
    setCustomerList(customerRedux?.customerList);
  }, [customerRedux?.customerList]);

  /**
   * to get customerList from firebase
   */
  const getCustomerList = useCallback(async () => {
    const newCustomerList = await CustomerServices.getCustomerList(userRedux);
    setCustomerList(newCustomerList);

    dispatch(saveCustomerList(newCustomerList));
    setIsRefreshing(false);
  }, []);

  const _itemSeparator = () => <View style={styles.separator} />;
  const _keyExtractor = (item: CustomerModel) => item.id;

  const _onPressCard = (item: CustomerModel) => {
    dispatch(selectedCustomer(item));
    navigation.navigate('ReportList');
  };

  const _renderItem = ({ item }: { item: CustomerModel }) => {
    return (
      <TouchableOpacity style={styles.card} onPress={() => _onPressCard(item)}>
        <BioIcon image={item.profileImg} />
        <View>
          <TextAtom style={styles.name}>{`${item.firstName} ${item.lastName}`}</TextAtom>
          <TextAtom style={styles.lastVisit}>{`${item.lastVisit}`}</TextAtom>
        </View>
      </TouchableOpacity>
    );
  };

  const _renderSectionHeader = ({ section }: { section: ICustomerListItem }) => {
    return (
      <View style={styles.sectionHeader}>
        <TextAtom style={styles.sectionHeaderText}>{section.initial}</TextAtom>
      </View>
    );
  };

  const _onAddButton = () => {
    dispatch(selectedCustomer());
    navigation.navigate('CustomerEdit');
  };

  const _onRefresh = async () => {
    getCustomerList();
    setIsRefreshing(true);
  };

  const _emptyListShow = () => {
    if (customerList.length <= 0) {
      return (
        <View style={styles.noListWrap}>
          <View style={styles.noListImagebox}>
            <Image source={require('~assets/images/cat_1.png')} style={styles.noListImage} />
          </View>
          <TextAtom style={styles.noListTextBold}>There is no customer yet.</TextAtom>
          <TextAtom style={styles.noListText}>
            Please tap &quot;+&quot; button below to add your customer
          </TextAtom>
        </View>
      );
    }
    return null;
  };

  if (isInitial) {
    return <ActivityIndicatorAtom />;
  }

  return (
    <View style={styles.sectionList}>
      <SectionList
        sections={customerList}
        keyExtractor={_keyExtractor}
        renderSectionHeader={_renderSectionHeader}
        renderItem={_renderItem}
        ItemSeparatorComponent={_itemSeparator}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={_onRefresh} />}
        ListFooterComponent={_emptyListShow}
      />
      <ListAddFloatButton onPress={_onAddButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionList: {
    flex: 1,
  },
  sectionHeader: {
    backgroundColor: '#fff',
  },
  sectionHeaderText: {
    fontSize: 16,
    color: '#676767',
    paddingHorizontal: '8%',
    paddingVertical: 10,
  },
  card: {
    paddingHorizontal: '12%',
    flexDirection: 'row',
    paddingVertical: 10,
  },
  separator: {
    backgroundColor: '#E2E8ED',
    height: 1,
  },
  name: {
    color: '#4C5264',
    fontSize: 16,
    marginVertical: 6,
  },
  lastVisit: {
    color: '#BCC5D3',
    fontSize: 12,
  },
  noListWrap: {
    height: Dimensions.get('screen').height - 110,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '10%',
  },
  noListImagebox: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noListImage: {
    width: '70%',
    resizeMode: 'contain',
    tintColor: '#dbdbdb',
  },
  noListTextBold: {
    ...generalTextStyles.boldLittleMediumText,
    color: AppGeneralColor.EmptyList.PrimaryText,
    textAlign: 'center',
    marginBottom: 18,
  },
  noListText: {
    ...generalTextStyles.regularLittleNormalText,
    color: AppGeneralColor.EmptyList.PrimaryText,
    textAlign: 'center',
  },
});

export default CustomerListHome;
