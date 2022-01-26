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

  startEndTime: ITimeValue; // {startTime: '10:00' || undifine, endTime: '14:00' || undifine}
  appointmentDate: IDateValue; //
  onConfirmDate: (dateValues: IDateValue) => void;
  onConfirmTime: (timeValue: ITimeValue) => void;
}

export const EditDateTimeOrganisms: React.FC<EditDateTimeOrganismsProps> = props => {
  console.log('props====organisms', props);
  return (
    <View style={props.container}>
      <View style={[styles.editDateBox, props.innerContainerStyle]}>
        <View>
          <EditDateMolecules
            onConfirm={props.onConfirmDate}
            appointmentDate={props.appointmentDate}
            containerStyle={styles.editDateText}
          />
          <EditTimeMolecules onConfirm={props.onConfirmTime} startEndTime={props.startEndTime} />
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
