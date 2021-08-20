import React, { useLayoutEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';

// navigation
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackNavParamList } from '~/route/types';

// component
import { TextAtom } from '~/components/atoms';
import { CheckMarkAtom } from '~/components/atoms/CheckMarkAtom';

// type
import { IMenuItem } from '~/modules/Menu/MenuInterfaces';

// style
import { AppGeneralColor } from '~/styles/ColorStyle';
import { generalTextStyles } from '~/styles/TextStyle';
import { GeneralNavStyles, GeneralViewStyle } from '~/styles/ViewStyle';
import { IButtonColorType, RoundButton } from '~/components/atoms/button/button';

interface SelectMenuListScreenProp {
  navigation: StackNavigationProp<MainStackNavParamList, 'SelectMenuListScreen'>;
}

const SelectMenuListScreen: React.FC<SelectMenuListScreenProp> = props => {
  const [checkedItems, setCheckedItems] = useState<IMenuItem[]>([]);

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

  const _onAddMenuItem = () => {
    props.navigation.navigate('AddMenuItemScreen');
  };

  const _renderItem = ({ item }: { item: IMenuItem }) => {
    const _onSelectItem = () => {
      const isAlreadyChecked = checkedItems.some(checkedItem => checkedItem.id === item.id);
      if (isAlreadyChecked) {
        const newItems = checkedItems.filter(checkedItem => checkedItem.id !== item.id);
        setCheckedItems(newItems);
      } else {
        setCheckedItems([...checkedItems, item]);
      }
    };

    const isChecked = checkedItems.some(checkedItem => checkedItem.id === item.id);

    return (
      <TouchableOpacity style={styles.itemWrapper} onPress={_onSelectItem}>
        <View style={styles.itemInnerWrapper}>
          <CheckMarkAtom isChecked={isChecked} onCheck={_onSelectItem} />
          <View style={styles.colorView} />
          <View style={styles.rightTextBox}>
            <TextAtom
              containerStyle={styles.menuItemNameTextContainer}
              style={styles.menuItemNameText}>
              {item.menuName}
            </TextAtom>
            <TextAtom style={styles.priceText}>{`$ ${item.price}`}</TextAtom>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const _keyExtractor = item => {
    return `${item.id}`;
  };

  const _onSelectMenu = () => {
    console.log('_onSelectMenu', checkedItems);
  };

  return (
    <View style={styles.container}>
      <RoundButton
        containerStyle={styles.titleWrapper}
        text={'Save Select'}
        buttonColorType={IButtonColorType.Confirm}
        textStyle={styles.titleText}
        onPress={_onSelectMenu}
        iconLeft={<Entypo name="add-to-list" size={20} color={AppGeneralColor.Palette.White} />}
      />
      <FlatList data={DATA} renderItem={_renderItem} keyExtractor={_keyExtractor} />
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
  itemWrapper: {
    borderColor: AppGeneralColor.SelectMenuList.listSeparator,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  itemInnerWrapper: {
    flexDirection: 'row',
    marginVertical: 10,
    ...GeneralViewStyle.bodyWrapper,
  },
  colorView: {
    width: 20,
    height: 20,
    marginTop: 2,
    backgroundColor: 'red',
    borderRadius: 10,
    marginHorizontal: 10,
  },
  rightTextBox: {
    flexShrink: 1,
    justifyContent: 'flex-start',
  },
  menuItemNameTextContainer: {
    flexShrink: 1,
  },
  menuItemNameText: {
    ...generalTextStyles.boldLittleMediumText,
  },
  priceText: {
    marginTop: 10,
    ...generalTextStyles.regularNormalText,
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
