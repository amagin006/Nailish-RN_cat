import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';

import CustomerModel from '~/modules/Customer/services/CusomerModels';

interface snsButtonProps {
  customer: CustomerModel;
}

const snsButtons: React.FC<snsButtonProps> = ({ customer }) => {
  return (
    <View style={styles.snsWrapper}>
      <TouchableOpacity
        disabled={!customer.mobile}
        style={!customer.mobile && styles.snsIconDisable}>
        <Image
          resizeMode={'contain'}
          style={styles.snsIcon}
          source={require('~assets/images/tel2.png')}
        />
      </TouchableOpacity>
      <TouchableOpacity disabled={!customer.mail} style={!customer.mail && styles.snsIconDisable}>
        <Image
          resizeMode={'contain'}
          style={styles.snsIcon}
          source={require('~assets/images/mail4.png')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        disabled={!customer.instagram}
        style={!customer.instagram && styles.snsIconDisable}>
        <Image
          resizeMode={'contain'}
          style={styles.snsIcon}
          source={require('~assets/images/instagram2.png')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        disabled={!customer.twitter}
        style={!customer.twitter && styles.snsIconDisable}>
        <Image
          resizeMode={'contain'}
          style={styles.snsIcon}
          source={require('~assets/images/twitter.png')}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  snsWrapper: {
    width: 165,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  snsIconDisable: {
    opacity: 0.3,
  },
  snsIcon: {
    width: 30,
    height: 30,
  },
});

export default snsButtons;
