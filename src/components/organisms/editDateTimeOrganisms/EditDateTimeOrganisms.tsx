import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import {
  EditDateMolecules,
  IDateValue,
} from '~/components/molecules/EditDateTimeMolecules/EditDateMolecules';
import {
  EditTimeMolecules,
  ITimeValue,
} from '~/components/molecules/EditDateTimeMolecules/EditTimeMolecules';

interface EditDateTimeOrganismsProps {
  container?: ViewStyle | ViewStyle[];
  innerContainerStyle?: ViewStyle;

  onConfirmDate: (dateValues: IDateValue) => void;
  onConfirmTime: (timeValue: ITimeValue) => void;
}

export const EditDateTimeOrganisms: React.FC<EditDateTimeOrganismsProps> = props => {
  return (
    <View style={props.container}>
      <View style={[styles.editDateBox, props.innerContainerStyle]}>
        <View>
          <EditDateMolecules onConfirm={props.onConfirmDate} containerStyle={styles.editDateText} />
          <EditTimeMolecules onConfirm={props.onConfirmTime} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  editDateBox: {
    alignItems: 'center',
  },
  editDateText: {
    marginBottom: 20,
  },
});
