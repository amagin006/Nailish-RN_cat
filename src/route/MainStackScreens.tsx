import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MainStackNavParamList } from '~/route/types';
import { BottomTabScreens } from '~/route/BottomTabScreens';

// component
import CustomerEdit from '~/screens/CustomerList/CustomerEdit';
import ReportList from '~/screens/CustomerList/ReportList';
import ReportEdit from '~/screens/CustomerList/ReportEdit';

// style
import { AppGeneralColor } from '~/styles/ColorStyle';
import ReportDetail from '~/screens/CustomerList/ReportDetail';

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
          title: 'Report List',
        }}
      />
      <MainStackNav.Screen
        name="ReportDetail"
        component={ReportDetail}
        options={{
          title: 'Report Detail',
        }}
      />
      <MainStackNav.Screen
        name="ReportEdit"
        component={ReportEdit}
        options={{
          title: 'Edit Report',
        }}
      />
    </MainStackNav.Navigator>
  );
};
