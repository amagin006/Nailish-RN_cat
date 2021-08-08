import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { GeneralViewStyle } from '~/styles/ViewStyle';

interface ReportMenuListProps {
  menuList: any[];
  style?: ViewStyle | ViewStyle[];
}

const ReportMenuList: React.FC<ReportMenuListProps> = ({ menuList, style }) => {
  return (
    <View style={style}>
      <View style={GeneralViewStyle.menuWrapper}>
        <Text style={GeneralViewStyle.leftColumn}>Menu</Text>
        <View style={GeneralViewStyle.rightColumn}>
          {menuList.map((menuItem, index) => {
            return (
              <View style={styles.menuItemRow} key={index}>
                <View style={[styles.menuItemBg, { backgroundColor: `${menuItem.bgcolor}` }]}>
                  <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.menuItemText}>
                    {menuItem.menuItem}
                  </Text>
                </View>
                <Text style={GeneralViewStyle.price}>$ {menuItem.price}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  menuItemRow: {
    marginBottom: 8,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemBg: {
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  leftColumn: {
    width: '20%',
  },
  rightColumn: {
    width: '50%',
  },
});

export default ReportMenuList;
