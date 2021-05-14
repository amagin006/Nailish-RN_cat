import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { BottomTabScreens } from '~/route/BottomTabScreens';

import { MainStackNavParamList } from '~/route/types';
import CustomerEdit from '~/screens/CustomerList/CustomerEdit';
import { AppGeneralColor } from '~/styles/ColorStyle';

const MainStackNav = createStackNavigator<MainStackNavParamList>();
export const MainStackScreens = () => {
  return (
    <MainStackNav.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: AppGeneralColor.Navigation.HeaderBackground,
        },
        headerTitleStyle: {
          color: '#fff',
        },
        headerBackTitleVisible: false,
        headerTintColor: '#fff',
      }}>
      <MainStackNav.Screen
        name="BottomNav"
        component={BottomTabScreens}
        options={{ headerShown: false }}
      />
      <MainStackNav.Screen name="CustomerEdit" component={CustomerEdit} />
    </MainStackNav.Navigator>
  );
};
