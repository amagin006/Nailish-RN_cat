import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { TextAtom } from '~/components/atoms';
import { IMenuListItem } from '~/modules/Menu/MenuInterfaces';
import { AppGeneralColor } from '~/styles/ColorStyle';
import { generalTextStyles } from '~/styles/TextStyle';
import { GeneralViewStyle } from '~/styles/ViewStyle';

interface ReportMenuListProps {
  container?: ViewStyle | ViewStyle[];
  menuList: IMenuListItem[];
}

const ReportMenuList: React.FC<ReportMenuListProps> = ({ menuList, container }) => {
  return (
    <View style={container}>
      <Text style={GeneralViewStyle.leftColumnText}>Menu</Text>
      <View style={GeneralViewStyle.priceColumn}>
        {menuList.map((menuItem, index) => {
          return (
            <View style={styles.menuItemRow} key={index}>
              <View style={styles.titleWrapper}>
                <View style={[styles.colorView, { backgroundColor: `${menuItem.color}` }]}>
                  <TextAtom style={styles.menuItemText}>{menuItem.menuName}</TextAtom>
                </View>
              </View>
              <View style={styles.priceWrapper}>
                <TextAtom style={styles.priceText}>$ {menuItem.price}</TextAtom>
                <TextAtom style={styles.amountText}>x {menuItem.amount}</TextAtom>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  menuItemRow: {
    marginBottom: 16,
    paddingBottom: 6,
    borderBottomColor: AppGeneralColor.SelectMenuList.listSeparator_2,
    borderBottomWidth: 0.5,
    alignItems: 'flex-end',
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemBg: {
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  colorView: {
    flexShrink: 1,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 4,
  },
  menuItemText: {
    ...generalTextStyles.boldNormalText,
    color: AppGeneralColor.Palette.White,
  },
  priceWrapper: {
    // alignItems: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: 10,
  },
  priceText: {
    ...generalTextStyles.regularNormalText,
  },
  amountText: {
    ...generalTextStyles.regularLittleNormalText,
    marginLeft: 10,
  },
});

export default ReportMenuList;
