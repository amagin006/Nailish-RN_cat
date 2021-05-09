import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Platform, SafeAreaView, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';

// util
import { firebaseAuth } from '~/config/Firebase';

// component
import { RoundButton } from '~/components/button/button';
import { userLoginWithPass, googleLogin, createUser, failedConfirm } from '~/redux/auth/actions';
import { TextAtom, TextInputAtom, PasswordTextInput } from '~/components/atoms';
import { AppGeneralColor } from '~/styles/ColorStyle';
import { ActivityIndicatorAtom } from '~/components/atoms/ActivityIndicatorAtom';
import { FaliedConfirmModal, ForgetModal } from './components/Modals';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [forgetEmail, setForgetEmail] = useState<string>('');
  const [password, setPassward] = useState<string>('');
  const [emailPassError, setEmaiPassError] = useState<boolean>(false);
  const [forgetEmailError, setForgetEmailError] = useState<boolean>(false);
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const [isForgetModalVisible, setIsForgetModalVisible] = useState<boolean>(false);
  const [isSendSuccess, setIsSendSuccess] = useState<boolean>(false);
  const [isSendLoading, setIsSendLoading] = useState<boolean>(false);
  const [createFailedMessage, setCreateFailedMessage] = useState<string>('');
  const [loginFailedMessage, setLoginFailedMessage] = useState<string>('');

  const dispatch = useAppDispatch();
  const reduxState = useAppSelector(state => state);

  useEffect(() => {
    const { auth } = reduxState;

    if (auth.createFailedMessage) {
      setCreateFailedMessage(auth.createFailedMessage);
    } else {
      setCreateFailedMessage('');
    }
    if (auth.loginFailedMessage) {
      setLoginFailedMessage(auth.loginFailedMessage);
    } else {
      setLoginFailedMessage('');
    }
  }, [reduxState]);

  const _onLoginWithEmail = () => {
    if (email && password) {
      dispatch(userLoginWithPass(email, password));
    } else {
      setEmaiPassError(true);
    }
  };

  const _googleLogin = () => {
    dispatch(googleLogin());
  };

  const _onCreateUser = () => {
    dispatch(createUser(email, password));
  };

  const _onSignup = () => {
    setIsSignup(true);
  };

  const _onResetPassword = async () => {
    setIsSendLoading(true);
    try {
      await firebaseAuth.sendPasswordResetEmail(forgetEmail);
      setForgetEmail('');
      setIsSendSuccess(true);
    } catch (error) {
      console.log('Error forgetPassword send email: ', error);
      setForgetEmailError(true);
    }
    setIsSendLoading(false);
  };

  const _onResetCancel = () => {
    setIsForgetModalVisible(false);
    setForgetEmailError(false);
    setForgetEmail('');
  };

  const _onForgetModal = () => {
    setIsForgetModalVisible(false);
    setIsSendSuccess(false);
  };

  const isError = forgetEmailError || emailPassError;

  return (
    <SafeAreaView style={styles.wrapper}>
      {reduxState.auth.isLoadingLogin ? (
        <ActivityIndicatorAtom />
      ) : (
        <>
          {isForgetModalVisible ? (
            <ForgetModal
              visible={isForgetModalVisible}
              onRequestClose={() => setIsForgetModalVisible(false)}
              onPressOk={_onForgetModal}
              onChangeText={text => setForgetEmail(text)}
              onFocusInput={() => setForgetEmailError(false)}
              onPressSend={_onResetPassword}
              onPressCancel={_onResetCancel}
              isLoading={isSendLoading}
              isSendSuccess={isSendSuccess}
              forgetEmailError={forgetEmailError}
              error={isError}
            />
          ) : createFailedMessage || loginFailedMessage ? (
            <FaliedConfirmModal
              visible={!!createFailedMessage || !!loginFailedMessage}
              onRequestClose={() => dispatch(failedConfirm())}
              modalInnerStyle={{ justifyContent: 'space-around' }}
              onPressOk={() => dispatch(failedConfirm())}
            />
          ) : null}
          <Image
            style={styles.logoImage}
            resizeMode={'contain'}
            source={require('../../../assets/images/logo2.png')}
          />
          <View style={styles.inner}>
            {emailPassError ? (
              <TextAtom style={styles.errorText}>Email or Password is wrong.</TextAtom>
            ) : (
              <View style={styles.space} />
            )}
            <TextInputAtom
              containerStyle={styles.inputTextBox}
              value={email}
              onChangeText={text => setEmail(text)}
              placeholder={'Enter your email'}
              onFocus={() => setEmaiPassError(false)}
              autoCapitalize={'none'}
              error={isError}
            />
            <PasswordTextInput
              containerStyle={styles.inputTextBox}
              value={password}
              onChangeText={text => setPassward(text)}
              placeholder={'Enter your password'}
              onFocus={() => setEmaiPassError(false)}
              autoCapitalize={'none'}
              error={isError}
              isPassword={true}
            />
            {isSignup ? (
              <RoundButton
                onPress={_onCreateUser}
                style={styles.blueButton}
                text={'Create Account'}
              />
            ) : (
              <>
                <TouchableOpacity
                  style={styles.forgetButton}
                  onPress={() => setIsForgetModalVisible(true)}>
                  <TextAtom style={styles.forgetText}>Forget password?</TextAtom>
                </TouchableOpacity>
                <RoundButton
                  onPress={_onLoginWithEmail}
                  style={styles.greenButton}
                  text={'Login'}
                />
              </>
            )}
            <View style={styles.border} />
            <TouchableOpacity style={styles.googleSingButton} onPress={_googleLogin}>
              <Image
                style={styles.googleImage}
                resizeMode={'contain'}
                source={require('~assets/images/google_signin_btn.png')}
              />
            </TouchableOpacity>
            <View style={styles.signUpBox}>
              <TextAtom style={styles.signUpleftText}>
                {isSignup ? 'Already have account?' : "Don't have an account?"}
              </TextAtom>
              <TouchableOpacity
                style={styles.signUpButton}
                onPress={isSignup ? () => setIsSignup(false) : _onSignup}>
                <TextAtom style={styles.signUpButtonText}>
                  {isSignup ? 'Sign in' : 'Sign up'}
                </TextAtom>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
  },
  inner: {
    width: '80%',
    marginTop: 30,
  },
  logoImage: {
    alignSelf: 'center',
    height: 80,
    marginTop: '18%',
  },
  inputTextBox: {
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  errorText: {
    color: '#d61d00',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  space: {
    marginBottom: Platform.OS === 'ios' ? 25 : 27,
  },
  forgetButton: {
    alignSelf: 'center',
    marginBottom: 6,
    borderBottomColor: AppGeneralColor.TextColor.Primary,
    borderBottomWidth: 1,
  },
  forgetText: {
    color: AppGeneralColor.TextColor.Primary,
    paddingBottom: 3,
  },
  border: {
    marginVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cfcfcf',
  },
  googleSingButton: {
    width: '48%',
    marginTop: -20,
    alignSelf: 'center',
  },
  googleImage: {
    width: '100%',
  },
  signUpButton: {
    alignSelf: 'center',
    borderBottomColor: '#344dd9',
    borderBottomWidth: 1,
  },
  signUpBox: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUpleftText: {
    color: '#7d7d7d',
    marginRight: 6,
  },
  signUpButtonText: {
    color: '#344dd9',
  },
  greenButton: {
    backgroundColor: AppGeneralColor.Palette.BaseGreen,
  },
  blueButton: {
    backgroundColor: AppGeneralColor.Palette.BaseBlue,
  },
});

export default Login;
