import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';

// util
import { Ionicons } from '@expo/vector-icons';
import { firebaseAuth } from '~/config/Firebase';

// component
import { RoundButton } from '~/components/button/button';
import { userLoginWithPass, googleLogin, createUser, failedConfirm } from '~/redux/auth/actions';
import TextAtom from '~/components/atoms/TextAtom';
import { generalTextStyles } from '~/styles/TextStyle';
import { AppGeneralColor } from '~/styles/ColorStyle';
import { ActivityIndicatorAtom } from '~/components/atoms/ActivityIndicatorAtom';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [forgetEmail, setForgetEmail] = useState<string>('');
  const [password, setPassward] = useState<string>('');
  const [isPasswordInVisible, setIsPasswordInVisible] = useState<boolean>(true);
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
    const { auth, user } = reduxState;

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

  const borderColor =
    emailPassError || forgetEmailError ? { borderColor: '#d61d00' } : { borderColor: '#ccc' };

  return (
    <SafeAreaView style={styles.wrapper}>
      {reduxState.auth.isLoadingLogin ? (
        <ActivityIndicatorAtom />
      ) : (
        <>
          {isForgetModalVisible ? (
            <Modal
              animationType="fade"
              transparent={true}
              visible={isForgetModalVisible}
              onRequestClose={() => setIsForgetModalVisible(false)}>
              <View style={styles.modalBack}>
                <View style={styles.modalInner}>
                  {isSendLoading ? (
                    <ActivityIndicatorAtom />
                  ) : isSendSuccess ? (
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      <TextAtom
                        containerStyle={{ marginBottom: 60 }}
                        style={styles.modalEmailSendText}>
                        An email has been sent to the address you have provided.{'\n'}Please check
                        your email
                      </TextAtom>
                      <RoundButton
                        onPress={() => {
                          setIsForgetModalVisible(false);
                          setIsSendSuccess(false);
                        }}
                        style={styles.greenButton}
                        text={'OK'}
                      />
                    </View>
                  ) : (
                    <>
                      <TextAtom style={styles.modalTitleText}>Reset your password</TextAtom>
                      <TextAtom style={styles.resetPassDiscText}>
                        Enter the email you use for Nailish, and we&apos;ll help you create a new
                        password.
                      </TextAtom>
                      <View style={styles.modalInnerbox}>
                        <View>
                          {forgetEmailError ? (
                            <TextAtom style={styles.errorText}>Email is invalid.</TextAtom>
                          ) : (
                            <View style={styles.space} />
                          )}
                          <View style={[styles.inputTextBox, borderColor]}>
                            <TextInput
                              style={styles.textInput}
                              value={forgetEmail}
                              onChangeText={text => setForgetEmail(text)}
                              placeholder={'Enter your email'}
                              onFocus={() => setForgetEmailError(false)}
                              autoCapitalize={'none'}
                            />
                          </View>
                        </View>
                      </View>
                      <View style={styles.modalButtonBox}>
                        <RoundButton
                          onPress={_onResetPassword}
                          style={styles.greenButton}
                          text={'Send'}
                        />
                        <RoundButton
                          onPress={_onResetCancel}
                          style={styles.pinkButton}
                          text={'Cancel'}
                        />
                      </View>
                    </>
                  )}
                </View>
              </View>
            </Modal>
          ) : createFailedMessage || loginFailedMessage ? (
            <Modal
              animationType="fade"
              transparent={true}
              visible={createFailedMessage || loginFailedMessage ? true : false}
              onRequestClose={() => dispatch(failedConfirm())}>
              <View style={styles.modalBack}>
                <View style={[styles.modalInner, { justifyContent: 'space-around' }]}>
                  <View>
                    <TextAtom style={styles.createFaliedText}>
                      {createFailedMessage || loginFailedMessage}
                    </TextAtom>
                    <TextAtom style={styles.createFaliedText}>Please try again</TextAtom>
                  </View>
                  <RoundButton
                    onPress={() => dispatch(failedConfirm())}
                    style={styles.greenButton}
                    text={'OK'}
                  />
                </View>
              </View>
            </Modal>
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
            <View style={[styles.inputTextBox, borderColor]}>
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={text => setEmail(text)}
                placeholder={'Enter your email'}
                onFocus={() => setEmaiPassError(false)}
                autoCapitalize={'none'}
              />
            </View>
            <View style={[styles.inputTextBox, borderColor]}>
              <TextInput
                style={styles.textInput}
                value={password}
                onChangeText={text => setPassward(text)}
                placeholder={'Enter your password'}
                onFocus={() => setEmaiPassError(false)}
                secureTextEntry={isPasswordInVisible}
                autoCapitalize={'none'}
              />
              <TouchableOpacity onPress={() => setIsPasswordInVisible(!isPasswordInVisible)}>
                <Ionicons
                  style={styles.eyeIcon}
                  name={isPasswordInVisible ? 'md-eye-off' : 'md-eye'}
                  size={26}
                />
              </TouchableOpacity>
            </View>
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
                source={require('../../../assets/images/google_signin_btn.png')}
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
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 5 : 0,
    borderRadius: 8,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    paddingVertical: 8,
  },
  errorText: {
    color: '#d61d00',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  space: {
    marginBottom: Platform.OS === 'ios' ? 25 : 27,
  },
  eyeIcon: {
    paddingTop: 3,
  },
  forgetButton: {
    alignSelf: 'center',
    marginBottom: 6,
    borderBottomColor: '#424242',
    borderBottomWidth: 1,
  },
  forgetText: {
    color: '#424242',
    paddingBottom: 3,
  },
  signButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#96CEB4',
    marginTop: 10,
    borderRadius: 18,
    marginHorizontal: 20,
  },
  createButton: {
    backgroundColor: '#2482bd',
  },
  singButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 10,
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
  modalBack: {
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalInner: {
    backgroundColor: '#fff',
    width: '90%',
    height: '60%',
    paddingHorizontal: '5%',
    borderRadius: 20,
  },
  modalTitleText: {
    fontSize: 26,
    // color: commonStyles.baseTextColor,
    marginVertical: 30,
  },
  modalInnerbox: {
    flex: 1,
    justifyContent: 'space-around',
  },
  resetPassDiscText: {
    // color: commonStyles.baseTextColor,
  },
  modalButtonBox: {
    marginBottom: 40,
  },
  modalCancelButton: {
    backgroundColor: '#ff9999',
    marginTop: 20,
  },
  createFaliedText: {
    fontSize: 18,
    marginBottom: 10,
    // color: commonStyles.baseTextColor,
    textAlign: 'center',
  },
  modalEmailSendText: {
    ...generalTextStyles.regularNormalText,
    color: AppGeneralColor.TextColor.Primary,
    marginBottom: 60,
  },
  greenButton: {
    backgroundColor: AppGeneralColor.Palette.BaseGreen,
  },
  pinkButton: {
    backgroundColor: AppGeneralColor.Palette.BasePink,
  },
  blueButton: {
    backgroundColor: AppGeneralColor.Palette.BaseBlue,
  },
});

export default Login;
