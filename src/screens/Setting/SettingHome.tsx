import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useAppDispatch } from '~/redux/hooks';
import PropTypes from 'prop-types';

import { userLogout } from '~/redux/auth/actions';

const SettingHome = () => {
  const dispatch = useAppDispatch();

  const _onLogout = () => {
    Alert.alert('Are you sure you want to Logout?', '', [
      { text: 'Cancel' },
      { text: 'OK', onPress: () => dispatch(userLogout()) },
    ]);
  };

  return (
    <SafeAreaView style={styles.sectionList}>
      <Image
        style={styles.logoImage}
        resizeMode={'contain'}
        source={require('../../../assets/images/logo2.png')}
      />
      <View style={styles.section}>
        <TouchableOpacity onPress={_onLogout}>
          <Text style={styles.sectionText}>Log out</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.versionText}>version 1.0.0</Text>
    </SafeAreaView>
  );
};

SettingHome.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  sectionList: {
    flex: 1,
  },
  logoImage: {
    marginTop: 40,
    marginBottom: 20,
    alignSelf: 'center',
    height: 80,
  },
  section: {
    marginTop: 40,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: '5%',
  },
  sectionText: {
    fontSize: 16,
    color: '#3e6ced',
    textAlign: 'center',
  },
  versionText: {
    marginTop: 20,
    textAlign: 'center',
  },
});

export default SettingHome;
