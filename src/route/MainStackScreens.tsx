import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MainStackNavParamList } from '~/route/types';
import { BottomTabScreens } from '~/route/BottomTabScreens';

// component
import CustomerEdit from '~/screens/CustomerList/CustomerEdit';
import ReportList from '~/screens/CustomerList/ReportList';

// style
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
      <MainStackNav.Screen
        name="CustomerEdit"
        component={CustomerEdit}
        options={{
          title: 'Add Customer',
        }}
      />
      <MainStackNav.Screen
        name="ReportList"
        component={ReportList}
        options={{
          title: 'Edit Report',
        }}
      />
    </MainStackNav.Navigator>
  );
};
