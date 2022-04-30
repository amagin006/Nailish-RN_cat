import React, { useLayoutEffect, useState, useEffect, useRef } from 'react';
import { FlatList, Image, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Entypo } from '@expo/vector-icons';

// redux
import { useAppSelector } from '~/redux/hooks';

// navigation
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackNavParamList } from '~/route/types';
import { RouteProp } from '@react-navigation/native';

// component
import { ActivityIndicatorAtom, TextAtom } from '~/components/atoms';
import { IButtonColorType, RoundButton } from '~/components/atoms/button/button';
import {
  EChangeAmountType,
  SelectMenuListItemMolecules,
} from '~/components/molecules/MenuListMolecules/SelectMenuListItemMolecules';

// type
import { IMenuItem, IMenuListItem } from '~/modules/Menu/MenuInterfaces';

// style
import { AppGeneralColor } from '~/styles/ColorStyle';
import { generalTextStyles } from '~/styles/TextStyle';
import { GeneralNavStyles } from '~/styles/ViewStyle';

// util
import {
  ChnageItemAmount,
  InitializeItemAmount,
  UpdateMenuList,
} from './helper/SelectMenuListHelper';
import { useCallback } from 'react';
import { MenuServices } from '~/modules/Menu/services/MenuServices';

interface SelectMenuListScreenProp {
  navigation: StackNavigationProp<MainStackNavParamList, 'SelectMenuListScreen'>;
  route: RouteProp<MainStackNavParamList, 'SelectMenuListScreen'>;
}

const SelectMenuListScreen: React.FC<SelectMenuListScreenProp> = props => {
  const [menuItems, setMenuItems] = useState<IMenuListItem[]>([]);
  const [openedItemIndex, setOpenedItemIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Ref for chat list item
  const menuItemRef = useRef<Swipeable[]>([]);

  // redux
  const userRedux = useAppSelector(state => state.user);

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

  // initial load
  useEffect(() => {
    const getListItems = async () => {
      setIsLoading(true);
      const items = await MenuServices.getMenuItemList(userRedux);
      // Initalize Item amount
      const listItems = InitializeItemAmount(items);
      setMenuItems(listItems);
      setIsLoading(false);
    };
    getListItems();
  }, []);

  // Fetch Menu List item and update with holding amount
  const _fetchToUpdateMenuList = useCallback(async () => {
    setIsLoading(true);
    const items = await MenuServices.getMenuItemList(userRedux);
    const newItems = UpdateMenuList(items, menuItems);
    setMenuItems(newItems);
    props.navigation.setParams({ updateItems: false });
    setIsLoading(false);
  }, [menuItems]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      if (props.route.params?.updateItems) {
        _fetchToUpdateMenuList();
      }
    });

    return unsubscribe;
  }, [props.route.params]);

  const _onAddMenuItem = () => {
    props.navigation.navigate('AddEditMenuItemScreen');
  };

  // when swipe open item
  const _onSwipeableRightOpen = (index: number) => {
    // when other item has already opened, close other items.
    if (openedItemIndex !== null) {
      menuItemRef.current[openedItemIndex].close();
    }
    setOpenedItemIndex(index);
  };

  // when swipe item is closed
  const _onSwipeableClose = (index: number) => {
    // when user closed latest opened item
    if (openedItemIndex === index) {
      setOpenedItemIndex(null);
    }
  };

  const _onEditItem = (item: IMenuItem, index: number) => {
    props.navigation.navigate('AddEditMenuItemScreen', { menuItem: item });
    menuItemRef.current[index].close();
  };

  const _onDeleteItem = () => {};

  const _onChnageItemAmount = (item: IMenuListItem, type: EChangeAmountType) => {
    // when other item has already opened, close other items.
    if (openedItemIndex !== null) {
      menuItemRef.current[openedItemIndex].close();
      return;
    }
    const newItems = ChnageItemAmount(item, type, menuItems);
    setMenuItems(newItems);
  };

  const _renderItem = ({ item, index }: { item: IMenuListItem; index: number }) => {
    return (
      <SelectMenuListItemMolecules
        ref={ref => {
          if (ref) {
            menuItemRef.current[index] = ref;
          }
        }}
        item={item}
        index={index}
        amount={item.amount}
        onChnageItemAmount={_onChnageItemAmount}
        onSwipeableClose={_onSwipeableClose}
        onSwipeableRightOpen={_onSwipeableRightOpen}
        onDelete={_onDeleteItem}
        onEdit={_onEditItem}
      />
    );
  };

  const _keyExtractor = (item: IMenuListItem) => {
    return `${item.id}`;
  };

  const _onSelectMenu = () => {
    const addedItems = menuItems.filter(item => item.amount > 0);
    props.navigation.navigate('NewReportAndEdit', { selectedMenuItems: addedItems });
  };

  const _emptyListShow = () => {
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
          <FlatList<IMenuListItem>
            data={menuItems}
            renderItem={_renderItem}
            keyExtractor={_keyExtractor}
            ListEmptyComponent={_emptyListShow}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={_fetchToUpdateMenuList} />
            }
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

export default SelectMenuListScreen;
