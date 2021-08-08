import React from 'react';
import { StyleSheet, View, Platform, ViewStyle } from 'react-native';

// Atom
import { TextAtom, ModalAtom, ActivityIndicatorAtom } from '~/components/atoms';
import { TextInputAtom } from '~/components/atoms/TextInputAtom';

// components
import { IButtonColorType, RoundButton } from '~/components/atoms/button/button';

// style
import { AppGeneralColor } from '~/styles/ColorStyle';
import { generalTextStyles } from '~/styles/TextStyle';

interface ForgetModalProps {
  visible: boolean;
  onRequestClose: () => void;

  // confirm modal
  onPressOk: () => void;

  // onPressButton Reset Modal
  onPressSend: () => void;
  onPressCancel: () => void;

  // TextInput
  onChangeText: (text: string) => void;
  onFocusInput: () => void;
  inputValue?: string;

  isLoading: boolean;
  isSendSuccess: boolean;
  forgetEmailError: boolean;
  error?: boolean;
}

export const ForgetModal: React.FC<ForgetModalProps> = props => {
  return (
    <ModalAtom visible={props.visible} onRequestClose={props.onRequestClose}>
      {props.isLoading ? (
        <ActivityIndicatorAtom />
      ) : props.isSendSuccess ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <TextAtom containerStyle={{ marginBottom: 60 }} style={styles.modalEmailSendText}>
            An email has been sent to the address you have provided.{'\n'}Please check your email
          </TextAtom>
          <RoundButton onPress={props.onPressOk} text={'OK'} />
        </View>
      ) : (
        <>
          <TextAtom style={styles.modalTitleText}>Reset your password</TextAtom>
          <TextAtom>
            Enter the email you use for Nailish, and we&apos;ll help you create a new password.
          </TextAtom>
          <View style={styles.modalInnerbox}>
            <View>
              {props.forgetEmailError ? (
                <TextAtom style={styles.errorText}>Email is invalid.</TextAtom>
              ) : (
                <View style={styles.space} />
              )}
              <TextInputAtom
                containerStyle={{ marginBottom: 20, paddingHorizontal: 10 }}
                value={props.inputValue}
                onChangeText={props.onChangeText}
                placeholder={'Enter your email'}
                onFocus={props.onFocusInput}
                error={props.error}
              />
            </View>
          </View>
          <View style={styles.modalButtonBox}>
            <RoundButton
              buttonColorType={IButtonColorType.Confirm}
              onPress={props.onPressSend}
              text={'Send'}
            />
            <RoundButton
              buttonColorType={IButtonColorType.Alert}
              onPress={props.onPressCancel}
              text={'Cancel'}
            />
          </View>
        </>
      )}
    </ModalAtom>
  );
};

interface FaliedConfirmModalProps {
  visible: boolean;
  onRequestClose: () => void;
  modalInnerStyle?: ViewStyle | ViewStyle[];

  createFailedMessage?: string;
  loginFailedMessage?: string;
  onPressOk: () => void;
}

export const FaliedConfirmModal: React.FC<FaliedConfirmModalProps> = props => {
  return (
    <ModalAtom
      visible={props.visible}
      onRequestClose={props.onRequestClose}
      modalInnerStyle={props.modalInnerStyle}>
      <View>
        <TextAtom style={styles.createFaliedText}>
          {props.createFailedMessage || props.loginFailedMessage || ''}
        </TextAtom>
        <TextAtom style={styles.createFaliedText}>Please try again</TextAtom>
      </View>
      <RoundButton
        buttonColorType={IButtonColorType.Primary}
        onPress={props.onPressOk}
        text={'OK'}
      />
    </ModalAtom>
  );
};

const styles = StyleSheet.create({
  modalEmailSendText: {
    ...generalTextStyles.regularNormalText,
    color: AppGeneralColor.TextColor.Primary,
    marginBottom: 60,
  },
  modalTitleText: {
    fontSize: 26,
    marginVertical: 30,
  },
  modalInnerbox: {
    flex: 1,
    justifyContent: 'space-around',
  },
  errorText: {
    color: AppGeneralColor.TextInput.Error,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  space: {
    marginBottom: Platform.OS === 'ios' ? 25 : 27,
  },
  modalButtonBox: {
    marginBottom: 40,
  },
  createFaliedText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
});
