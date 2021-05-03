import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabNavParamList } from '~/navigationRoute/types';

// screens
import CustomerListHome from '~/screens/CustomerList/CustomerListHome';
import CalenderHome from '~/screens/Calender/CalenderHome';
import SettingHome from '~/screens/Setting/SettingHome';

const BottomTab = createBottomTabNavigator<BottomTabNavParamList>();

export const BottomTabScreens: React.FC = () => {
  return (
    <BottomTab.Navigator initialRouteName="CustomerListHome">
      <BottomTab.Screen name="CustomerListHome" component={CustomerListHome} />
      <BottomTab.Screen name="CalenderHome" component={CalenderHome} />
      <BottomTab.Screen name="SettingHome" component={SettingHome} />
    </BottomTab.Navigator>
  );
};
