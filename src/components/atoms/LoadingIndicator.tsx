import React from 'react';
import { Modal, View } from 'react-native';
import { ActivityIndicatorAtom } from '~/components/atoms/ActivityIndicatorAtom';
import { AppGeneralColor } from '~/styles/ColorStyle';

export interface LoadingIndicatorProps {
  isLoading: boolean;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = props => {
  return (
    <Modal animationType="fade" transparent={true} visible={props.isLoading}>
      <View
        style={{
          backgroundColor: AppGeneralColor.Modal.BaseBackground,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicatorAtom color={AppGeneralColor.Palette.White} />
      </View>
    </Modal>
  );
};
