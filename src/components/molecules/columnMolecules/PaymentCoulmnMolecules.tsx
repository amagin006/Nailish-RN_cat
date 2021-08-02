import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { PickerModalAtom } from '~/components/atoms';
import { IPickerItem } from '~/components/atoms/PickerModalAtom';
import { TextLeftAtom } from '~/components/atoms/TextAtom';

interface PaymentCoulmnMoleculesProps {
  container?: ViewStyle;

  options: IPickerItem[];
  onConfirm?: (id: number) => void;
}

export const PaymentCoulmnMolecules: React.FC<PaymentCoulmnMoleculesProps> = props => {
  return (
    <View style={[props.container, styles.columnWrapper]}>
      <TextLeftAtom>Payment</TextLeftAtom>
      <PickerModalAtom options={props.options} onConfirm={props.onConfirm} />
    </View>
  );
};

const styles = StyleSheet.create({
  columnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
});
