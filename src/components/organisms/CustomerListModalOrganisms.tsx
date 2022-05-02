import React from 'react';
import { Dimensions, Image, Platform, SectionList, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CustomerModel from '~/modules/Customer/services/CustomerModels';
import { ICustomerListItem } from '~/modules/CustomerList/CustomerListInterfaces';
import { useAppSelector } from '~/redux/hooks';
import { AppGeneralColor } from '~/styles/ColorStyle';
import { generalTextStyles } from '~/styles/TextStyle';
import { TextAtom } from '../atoms';
import { BioIcon } from '../atoms/photoIcon/BioIcon';
import { MaterialIcons } from '@expo/vector-icons';

interface CustomerListModalOrganismsProps {
  isVisible: boolean;
  onSelect: (item: CustomerModel) => void;
  onClose: () => void;
}

export const CustomerListModalOrganisms: React.FC<CustomerListModalOrganismsProps> = props => {
  const customerList = useAppSelector(state => state.customer?.customerList);

  const _itemSeparator = () => <View style={styles.separator} />;
  const _keyExtractor = (item: CustomerModel) => item.id;

  const _renderSectionHeader = ({ section }: { section: ICustomerListItem }) => {
    return (
      <View style={styles.sectionHeader}>
        <TextAtom style={styles.sectionHeaderText}>{section.initial}</TextAtom>
      </View>
    );
  };

  const _onPressCard = (item: CustomerModel) => {
    props.onSelect(item);
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

  const _emptyListShow = () => {
    if (customerList.length <= 0) {
      return (
        <View style={styles.noListWrap}>
          <View style={styles.noListImagebox}>
            <Image source={require('~assets/images/cat_1.png')} style={styles.noListImage} />
          </View>
          <TextAtom style={styles.noListTextBold}>There is no customer yet.</TextAtom>
        </View>
      );
    }
    return null;
  };

  return (
    <Modal isVisible={props.isVisible} style={{ margin: 0 }}>
      <View
        style={{
          backgroundColor: AppGeneralColor.Modal.BaseInner,
          marginTop: 60,
          borderRadius: 12,
        }}>
        <ListHeaderComponent onClose={props.onClose} />
        <SectionList
          sections={[...customerList, ...customerList]}
          keyExtractor={_keyExtractor}
          renderSectionHeader={_renderSectionHeader}
          stickySectionHeadersEnabled={false}
          renderItem={_renderItem}
          ItemSeparatorComponent={_itemSeparator}
          ListFooterComponent={_emptyListShow}
        />
      </View>
    </Modal>
  );
};

const ListHeaderComponent = ({ onClose }: { onClose: () => void }) => {
  return (
    <View style={{ alignItems: 'flex-end', marginRight: 10, marginVertical: 6 }}>
      <TouchableOpacity onPress={onClose} style={{ padding: 6 }}>
        <MaterialIcons name="close" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    backgroundColor: AppGeneralColor.Modal.SubBackgound,
  },
  sectionHeaderText: {
    fontSize: 16,
    color: '#676767',
    paddingHorizontal: '8%',
    paddingVertical: 10,
  },
  card: {
    flexDirection: 'row',
    padding: 10,
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
