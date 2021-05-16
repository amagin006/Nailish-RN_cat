/* eslint-disable react/display-name */
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

import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { saveCustomerList } from '~/redux/customer/actions';

import { ListAddFloatButton } from '~/components/button/ListAddFloatButton';

import CustomerModel from '~/modules/customer/services/cusomerModels';
import CustomerListFactory from '~/modules/customerList/services/CustomerListFactory';
import { BioIcon } from '~/components/photoIcon/BioIcon';

interface ICustomerListItem {
  initial?: string;
  data: CustomerModel[];
}

const customerListPresenter = CustomerListFactory.getCustomerListRepository();

const CustomerListHome = ({ navigation }) => {
  const [customerList, setCustomerList] = useState<ICustomerListItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const userRedux = useAppSelector(state => state.user);
  const customerRedux = useAppSelector(state => state.customer);
  const dispatch = useAppDispatch();

  // Initialized
  useEffect(() => {
    getCustomerList();
  }, [userRedux]);

  useEffect(() => {
    setCustomerList(customerRedux?.customerList);
  }, [customerRedux?.customerList]);

  /**
   * to get customerList from firebase
   */
  const getCustomerList = useCallback(async () => {
    const newCustomerList = await customerListPresenter.getCustomerList(userRedux);
    setCustomerList(newCustomerList);

    dispatch(saveCustomerList(newCustomerList));
    setIsRefreshing(false);
  }, []);

  const _itemSeparator = () => <View style={styles.separator} />;
  const _keyExtractor = item => item.id;

  const _onPressCard = item => {
    navigation.navigate('ReportList', { customer: item });
  };

  const _renderItem = ({ item }) => {
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

  const _renderSectionHeader = ({ section: data }) => {
    return (
      <View style={styles.sectionHeader}>
        <TextAtom style={styles.sectionHeaderText}>{data.initial}</TextAtom>
      </View>
    );
  };

  const _onAddButton = () => {
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
            <Image
              source={require('../../../assets/images/cat_1.png')}
              style={styles.noListImage}
            />
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
    fontSize: 20,
    textAlign: 'center',
    color: '#b0b0b0',
    marginBottom: 18,
  },
  noListText: {
    fontSize: 15,
    color: '#b0b0b0',
    textAlign: 'center',
  },
});

export default CustomerListHome;
