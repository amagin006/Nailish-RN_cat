import React, { useState, useEffect } from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { firebaseAuth } from '~/config/Firebase';

// Redux
import { useAppSelector, useAppDispatch } from '~/redux/hooks';
import { userSet, userUnSet } from '~/redux/user/actions';

// type
import { RootStackParamList, SplashStackParamList } from '~/navigationRoute/types';

// Screens
import Splash from '~/Splash';
import Login from '~/screens/Login/Login';
import { BottomTabScreens } from '~/navigationRoute/BottomTabScreens';

const RootStackNav = createStackNavigator<RootStackParamList>();
const SplashNav = createStackNavigator<SplashStackParamList>();

const RootNavigator = () => {
  // redux
  const dispatch = useAppDispatch();
  const userToken = useAppSelector(state => state.user.uid);

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
      {userToken ? (
        <RootStackNav.Screen name="BottomNav" component={BottomTabScreens} />
      ) : (
        <RootStackNav.Screen name="LoginNav" component={Login} options={{ headerShown: false }} />
      )}
    </RootStackNav.Navigator>
  );
};

export default RootNavigator;
