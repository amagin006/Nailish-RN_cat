import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { GeneralViewStyle } from '~/styles/ViewStyle';

interface PriceDetailProps {
  menuList: any[];
  tips?: number;
}

const PriceDetail: React.FC<PriceDetailProps> = ({ menuList, tips }) => {
  const subtotal = menuList
    .map(menuItem => parseInt(menuItem.price))
    .reduce((total, price) => total + price);

  const tipsPrice = tips ? tips : 0;
  const TAX = 0.12;
  const taxTotal = Math.round(subtotal * TAX);
  const total = subtotal + taxTotal + tipsPrice;
  return (
    <>
      <View style={GeneralViewStyle.menuWrapper}>
        <Text style={GeneralViewStyle.leftColumn}>Subtotal</Text>
        <Text style={GeneralViewStyle.price}>{`$ ${subtotal}`}</Text>
      </View>
      <View style={GeneralViewStyle.menuWrapper}>
        <Text style={GeneralViewStyle.leftColumn}>Tips</Text>
        <Text style={GeneralViewStyle.price}>{`$ ${tipsPrice}`}</Text>
      </View>
      <View style={GeneralViewStyle.menuWrapper}>
        <Text style={GeneralViewStyle.leftColumn}>Tips</Text>
        <Text style={GeneralViewStyle.price}>{`$ ${taxTotal}`}</Text>
      </View>
      <View style={[GeneralViewStyle.menuWrapper, styles.total]}>
        <Text style={GeneralViewStyle.leftColumn}>Total</Text>
        <Text style={GeneralViewStyle.price}>{`$ ${total}`}</Text>
      </View>
      <View style={GeneralViewStyle.menuWrapper}>
        <Text style={GeneralViewStyle.leftColumn}>Payment</Text>
        <Text style={styles.rightText}>Credit card</Text>
      </View>
      <View style={styles.memo}>
        <Text style={styles.memoTitle}>Memo</Text>
        <View style={styles.memoInner}>
          <Text style={styles.memoText}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the standard dummy text ever since the 1500s, when an unknown printer took a
            galley of type and scrambled it to make a type specimen book. It has survived not only
            five centuries, but also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of Letraset sheets
            containing Lorem Ipsum passages, and more recently with desktop publishing software like
            Aldus PageMaker including versions of Lorem Ipsum.
          </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  total: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#9c9c9c',
  },
  rightText: {
    fontSize: 16,
  },
  memo: {
    marginTop: 10,
    marginBottom: 20,
  },
  memoInner: {
    paddingHorizontal: '3%',
  },
  memoTitle: {
    fontSize: 18,
    color: '#9c9c9c',
  },
  memoText: {
    marginTop: 10,
  },
});

export default PriceDetail;
