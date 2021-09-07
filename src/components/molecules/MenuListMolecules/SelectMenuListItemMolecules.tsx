import React from 'react';
import { View, TouchableOpacity, TouchableHighlight, StyleSheet } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { FontAwesome5, Feather } from '@expo/vector-icons';

// components
// import { CheckMarkAtom } from '~/components/atoms/CheckMarkAtom';

import { TextAtom } from '~/components/atoms';

// type
import { IMenuItem, IMenuListItem } from '~/modules/Menu/MenuInterfaces';

// style
import { AppGeneralColor } from '~/styles/ColorStyle';
import { GeneralViewStyle } from '~/styles/ViewStyle';
import { generalTextStyles } from '~/styles/TextStyle';

interface SelectMenuListItemMoleculesProps {
  item: IMenuListItem;
  index: number;
  amount: number;

  onChnageItemAmount: (item: IMenuListItem, type: EChangeAmountType) => void;
  onSwipeableClose: (index: number) => void;
  onSwipeableRightOpen: (index: number) => void;
  onDelete: (selectedItem: IMenuItem) => void;
  onEdit: (selectedItem: IMenuItem, index: number) => void;
}

export enum EChangeAmountType {
  ADD = 'ADD',
  MINUS = 'MINUS',
}

type RefType = Swipeable;

export const SelectMenuListItemMolecules = React.forwardRef<
  RefType,
  SelectMenuListItemMoleculesProps
>((props, ref) => {
  const _onSwipableRightOpen = () => {
    console.log('_onSwipableRightOpen');
    props.onSwipeableRightOpen(props.index);
  };

  const _onDeleteItem = () => {
    props.onDelete(props.item);
  };

  const _onEditItem = () => {
    props.onEdit(props.item, props.index);
  };

  const _rightSwipeView = () => {
    return (
      <View style={styles.swipedBackground}>
        <TouchableOpacity onPress={_onDeleteItem}>
          <View style={[styles.swipeItemBg, styles.deleteSwipeBg]}>
            <FontAwesome5 name="trash" size={24} color={AppGeneralColor.SelectMenuList.swipeIcon} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={_onEditItem}>
          <View style={[styles.swipeItemBg, styles.editSwipeBg]}>
            <FontAwesome5 name="edit" size={24} color={AppGeneralColor.SelectMenuList.swipeIcon} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const _onSwipeableClose = () => {
    props.onSwipeableClose(props.index);
  };

  const _onPlus = () => {
    props.onChnageItemAmount(props.item, EChangeAmountType.ADD);
  };

  const _onMinus = () => {
    props.onChnageItemAmount(props.item, EChangeAmountType.MINUS);
  };

  return (
    <Swipeable
      ref={ref}
      containerStyle={styles.swipeContainerStyle}
      onSwipeableRightWillOpen={_onSwipableRightOpen}
      onSwipeableClose={_onSwipeableClose}
      renderRightActions={_rightSwipeView}
      overshootRight={false}>
      <View style={styles.itemBg}>
        <View style={styles.itemInnerWrapper}>
          <View style={styles.itemLeft}>
            <View style={[styles.colorView, { backgroundColor: props.item.color }]} />
            <View style={styles.rightTextBox}>
              <TextAtom
                containerStyle={styles.menuItemNameTextContainer}
                style={styles.menuItemNameText}>
                {props.item.menuName}
              </TextAtom>
              <TextAtom style={styles.priceText}>{`$ ${props.item.price}`}</TextAtom>
            </View>
          </View>
          <View style={styles.counterBox}>
            <TouchableOpacity onPress={_onPlus}>
              <Feather name="plus-circle" size={30} color={AppGeneralColor.TextColor.Primary} />
            </TouchableOpacity>
            <View style={styles.countAmoutTextBox}>
              <TextAtom style={styles.countAmoutText}>{`${props.amount}`}</TextAtom>
            </View>
            <TouchableOpacity onPress={_onMinus}>
              <Feather name="minus-circle" size={30} color={AppGeneralColor.TextColor.Primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Swipeable>
  );
});

const styles = StyleSheet.create({
  swipeContainerStyle: {},
  swipedBackground: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  swipeItemBg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  editSwipeBg: {
    backgroundColor: 'yellow',
    paddingLeft: 8,
  },
  deleteSwipeBg: {
    backgroundColor: 'red',
  },
  itemBg: {
    borderColor: AppGeneralColor.SelectMenuList.listSeparator,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: '#fff',
  },
  itemInnerWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    ...GeneralViewStyle.bodyWrapper,
  },
  itemLeft: {
    flexDirection: 'row',
    flexShrink: 1,
    marginRight: 10,
  },
  colorView: {
    width: 20,
    height: 20,
    marginTop: 2,
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
  counterBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countAmoutTextBox: {
    backgroundColor: AppGeneralColor.Counter.CounterBackground,
  },
  countAmoutText: {
    width: 38,
    textAlign: 'center',
    ...generalTextStyles.regularNormalText,
  },
});
