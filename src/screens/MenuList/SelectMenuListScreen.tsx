import React, { useLayoutEffect, useState, useEffect, useRef } from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Entypo } from '@expo/vector-icons';

// redux
import { useSelector } from 'react-redux';
import { RootState } from '~/redux/store';

// navigation
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackNavParamList } from '~/route/types';

// component
import { ActivityIndicatorAtom, TextAtom } from '~/components/atoms';
import { IButtonColorType, RoundButton } from '~/components/atoms/button/button';
import { SelectMenuListItemMolecules } from '~/components/molecules/MenuListMolecules/SelectMenuListItemMolecules';

// type
import { IMenuItem } from '~/modules/Menu/MenuInterfaces';

// style
import { AppGeneralColor } from '~/styles/ColorStyle';
import { generalTextStyles } from '~/styles/TextStyle';
import { GeneralNavStyles } from '~/styles/ViewStyle';

import MenuFactory from '~/modules/Menu/services/MenuFactory';

interface SelectMenuListScreenProp {
  navigation: StackNavigationProp<MainStackNavParamList, 'SelectMenuListScreen'>;
}

const MenuPresenter = MenuFactory.getMenuPresenter();

const SelectMenuListScreen: React.FC<SelectMenuListScreenProp> = props => {
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<IMenuItem[]>([]);
  const [openedItemIndex, setOpenedItemIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Ref for chat list item
  const menuItemRef = useRef<Swipeable[]>([]);

  // redux
  const userRedux = useSelector((state: RootState) => state.user);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity style={GeneralNavStyles.headerRight} onPress={_onAddMenuItem}>
            <TextAtom style={GeneralNavStyles.headerRightText}>Add Item</TextAtom>
          </TouchableOpacity>
        );
      },
    });
  }, [props.navigation]);

  useEffect(() => {
    const getListItems = async () => {
      setIsLoading(true);
      const items = await MenuPresenter.getMenuItemList(userRedux);
      setMenuItems(items);
      setIsLoading(false);
    };
    getListItems();
  }, []);

  const _onAddMenuItem = () => {
    props.navigation.navigate('AddEditMenuItemScreen');
  };

  const _onSelectItem = (item: IMenuItem) => {
    if (openedItemIndex !== null) {
      menuItemRef.current[openedItemIndex].close();
      setOpenedItemIndex(null);
      return;
    }
    const isAlreadyChecked = checkedItems.some(checkedItem => checkedItem.id === item.id);
    if (isAlreadyChecked) {
      const newItems = checkedItems.filter(checkedItem => checkedItem.id !== item.id);
      setCheckedItems(newItems);
    } else {
      setCheckedItems([...checkedItems, item]);
    }
  };

  // when swipe open item
  const _onSwipeableRightOpen = index => {
    // when other item has already opened, close other items.
    if (openedItemIndex !== null) {
      menuItemRef.current[openedItemIndex].close();
    }
    setOpenedItemIndex(index);
  };

  // when swipe item is closed
  const _onSwipeableClose = index => {
    // when user closed latest opened item
    if (openedItemIndex === index) {
      setOpenedItemIndex(null);
    }
  };

  const _onEditItem = (item: IMenuItem, index: number) => {
    props.navigation.navigate('AddEditMenuItemScreen', item);
    menuItemRef.current[index].close();
  };

  const _onDeleteItem = () => {};

  const _onPlusItem = () => {};

  const _onMinusItem = () => {};

  const _renderItem = ({ item, index }: { item: IMenuItem; index: number }) => {
    return (
      <SelectMenuListItemMolecules
        ref={ref => {
          if (ref) {
            menuItemRef.current[index] = ref;
          }
        }}
        item={item}
        index={index}
        // TODO: item amount
        amount={20}
        onMinusItem={_onMinusItem}
        onPlusItem={_onPlusItem}
        onSwipeableClose={_onSwipeableClose}
        onSwipeableRightOpen={_onSwipeableRightOpen}
        onDelete={_onDeleteItem}
        onEdit={_onEditItem}
      />
    );
  };

  const _keyExtractor = item => {
    return `${item.id}`;
  };

  const _onSelectMenu = () => {
    console.log('_onSelectMenu', checkedItems);
  };

  const _emptyListShow = () => {
    // if (customerList.length <= 0) {
    return (
      <View style={styles.noListWrap}>
        <View style={styles.noListImagebox}>
          <Image source={require('~assets/images/cat_1.png')} style={styles.noListImage} />
        </View>
        <TextAtom style={styles.noListTextBold}>There is no Menu Item.</TextAtom>
        <TextAtom style={styles.noListText}>
          &quot;Add Item&quot; header button to add your Menu
        </TextAtom>
      </View>
    );
    // }
    // return null;
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicatorAtom />
      ) : (
        <>
          <RoundButton
            containerStyle={styles.titleWrapper}
            text={'Save Select'}
            buttonColorType={IButtonColorType.Confirm}
            textStyle={styles.titleText}
            onPress={_onSelectMenu}
            iconLeft={<Entypo name="add-to-list" size={20} color={AppGeneralColor.Palette.White} />}
          />
          <FlatList
            data={menuItems}
            renderItem={_renderItem}
            keyExtractor={_keyExtractor}
            ListEmptyComponent={_emptyListShow}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleText: {
    marginLeft: 20,
    ...generalTextStyles.regularNormalText,
  },
  titleWrapper: {
    marginVertical: 18,
    marginHorizontal: 40,
  },
  noListWrap: {
    marginTop: 30,
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
    tintColor: AppGeneralColor.EmptyList.tint,
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

const DATA = [
  {
    id: '1',
    menuName: 'Gel',
    color: '#FF7B7B',
    price: '20.0',
  },
  {
    id: '2',
    menuName: 'Off',
    color: '#7B8AFF',
    price: '10.0',
  },
  {
    id: '3',
    menuName: 'Design ---------- sddskfkfdsdfsdfsddskadskjdsfkjsdkfjklds',
    color: '#79AF52',
    price: '500000000.0',
  },
];

export default SelectMenuListScreen;
