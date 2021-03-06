import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MainStackNavParamList } from '~/route/types';
import { BottomTabScreens } from '~/route/BottomTabScreens';

// component
import CustomerEdit from '~/screens/CustomerList/CustomerEdit';
import ReportList from '~/screens/CustomerList/ReportList';
import NewReportAndEdit from '~/screens/CustomerList/NewReportAndEdit';
import ReportDetail from '~/screens/CustomerList/ReportDetail';

import EditAppointment from '~/screens/Calender/EditAppointment';

import AddEditMenuItemScreen from '~/screens/MenuList/AddEditMenuItemScreen';

// style
import { AppGeneralColor } from '~/styles/ColorStyle';
import SelectMenuListScreen from '~/screens/MenuList/SelectMenuListScreen';

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

      {/* --------- CustomerList ---------- */}
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
      <MainStackNav.Screen name="NewReportAndEdit" component={NewReportAndEdit} />
      {/* --------- CustomerList ---------- */}

      {/* --------- Calender ---------- */}
      <MainStackNav.Screen
        name="EditAppointment"
        component={EditAppointment}
        options={{
          title: 'Edit Appointment',
        }}
      />

      {/* --------- Calender ---------- */}

      {/* --------- SelectMenuList ---------- */}
      <MainStackNav.Screen
        name="SelectMenuListScreen"
        component={SelectMenuListScreen}
        options={{
          title: 'Select Menu',
        }}
      />
      <MainStackNav.Screen
        name="AddEditMenuItemScreen"
        component={AddEditMenuItemScreen}
        options={{
          title: 'Add Menu Item',
        }}
      />
      {/* --------- SelectMenuList ---------- */}
    </MainStackNav.Navigator>
  );
};
