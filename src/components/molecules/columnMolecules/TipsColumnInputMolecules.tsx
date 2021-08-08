import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

// components
import { TextInputAtom } from '~/components/atoms';
import { TextAtom, TextLeftAtom } from '~/components/atoms/TextAtom';
import { generalTextStyles } from '~/styles/TextStyle';

interface TipsColumnInputMoleculesProps {
  container?: ViewStyle;

  value: string;
  onChangeTips: (text: string) => void;
}

export const TipsColumnInputMolecules: React.FC<TipsColumnInputMoleculesProps> = props => {
  return (
    <View style={[styles.columnWrapper, props.container]}>
      <TextLeftAtom>Tips</TextLeftAtom>
      <View style={styles.tipsWrapper}>
        <TextAtom style={styles.dollerMark}>$</TextAtom>
        <View style={{ flexGrow: 1 }}>
          <TextInputAtom
            placeholder="0.00"
            keyboardType={'number-pad'}
            style={styles.tipTextInput}
            value={props.value}
            onChangeText={props.onChangeTips}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  columnWrapper: {
    flexDirection: 'row',
  },
  tipsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dollerMark: {
    ...generalTextStyles.regularLittleNormalText,
    marginRight: 10,
  },
  tipTextInput: {
    flexGrow: 1,
  },
});
