import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { BottomTabScreens } from '~/route/BottomTabScreens';

import { MainStackNavParamList } from '~/route/types';

const MainStackNav = createStackNavigator<MainStackNavParamList>();
export const MainStackScreens = () => {
  return (
    <MainStackNav.Navigator>
      <MainStackNav.Screen
        name="BottomNav"
        component={BottomTabScreens}
        options={{ headerShown: false }}
      />
    </MainStackNav.Navigator>
  );
};
