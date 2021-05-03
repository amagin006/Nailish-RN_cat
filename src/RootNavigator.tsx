import React, { useState, useEffect } from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';

import { firebaseAuth } from '~/config/Firebase';

// Screens
import Splash from '~/Splash';

const RootStackNav = createStackNavigator();
const SplashNav = createStackNavigator();

const RootNavigator = () => {
  // redux
  const dispatch = useDispatch();
  const userToken = useSelector(state => state.user.uid);

  const [splash, setSplash] = useState(true);

  useEffect(() => {
    const unsubscribe = _onAuthStateChanged();
    return unsubscribe;
  }, []);

  const _tokenLoadFinished = () => {
    setSplash(false);
  };

  function _onAuthStateChanged() {
    return firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        // navigation.navigate('CustomerListHome');
        dispatch(userSet(user));
      } else {
        console.log('user logout-------onAuthStateChanged-------', user);
        dispatch(userUnSet());
      }
    });
  }

  if (splash) {
    return (
      <SplashNav.Navigator>
        <SplashNav.Screen name="Splash" options={{ headerShown: false }}>
          {() => <Splash tokenLoadFinished={_tokenLoadFinished} />}
        </SplashNav.Screen>
      </SplashNav.Navigator>
    );
  }
  return (
    <RootStackNav.Navigator
      screenOptions={() => ({
        gestureEnabled: true,
        ...TransitionPresets.SlideFromRightIOS,
        animationEnabled: false,
      })}>
      {/* {userToken ? (
        <RootStackNav.Screen name="BottomNav" component={BottomTabScreens} />
      ) : (
        <RootStackNav.Screen name="LoginNav" component={Login} options={{ headerShown: false }} />
      )} */}
    </RootStackNav.Navigator>
  );
};

export default RootNavigator;
