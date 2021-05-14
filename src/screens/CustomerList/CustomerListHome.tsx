/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import {
  SectionList,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { TextAtom } from '~/components/atoms/TextAtom';

import { useAppSelector } from '~/redux/hooks';

import { ListAddFloatButton } from '~/components/button/ListAddFloatButton';

import CustomerModel from '~/modules/customer/services/cusomerModels';
import CustomerListFactory from '~/modules/customerList/services/CustomerListFactory';

interface ICustomerListItem {
  initial?: string;
  data: CustomerModel[];
}

const customerListPresenter = CustomerListFactory.getCustomerListRepository();

const CustomerListHome = ({ navigation }) => {
  const [customerList, setCustomerList] = useState<ICustomerListItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const user = useAppSelector(state => state.user);

  useEffect(() => {
    async function getCustomerList() {
      const newCustomerList = await customerListPresenter.getCustomerList(user);
      setCustomerList(newCustomerList);
      setIsRefreshing(false);
    }
    getCustomerList();
  }, [user, isRefreshing]);

  const _itemSeparator = () => <View style={styles.separator} />;
  const _keyExtractor = item => item.id;

  const _onPressCard = item => {
    navigation.navigate('ReportList', item);
  };

  const _renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.card} onPress={() => _onPressCard(item)}>
        <Image source={{ uri: `${item.profileImg}` }} style={styles.userIcon} />
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
    setIsRefreshing(true);
  };

  return (
    <View style={styles.sectionList}>
      {customerList.length > 0 ? (
        <SectionList
          sections={customerList}
          keyExtractor={_keyExtractor}
          renderSectionHeader={_renderSectionHeader}
          renderItem={_renderItem}
          ItemSeparatorComponent={_itemSeparator}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={_onRefresh} />}
        />
      ) : (
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={_onRefresh} />}>
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
        </ScrollView>
      )}
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
  userIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '10%',
  },
  noListImagebox: {
    width: 200,
    height: 200,
    marginTop: -200,
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
