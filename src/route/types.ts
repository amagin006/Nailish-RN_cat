import { NavigatorScreenParams } from '@react-navigation/native';
import CustomerModel from '~/modules/customer/services/cusomerModels';

export type RootStackParamList = {
  MainNav: NavigatorScreenParams<MainStackNavParamList>;
  LoginNav: undefined;
};

export type SplashStackParamList = {
  Splash: undefined;
};

export type BottomTabNavParamList = {
  CustomerList: NavigatorScreenParams<CustomerListStackNavParamsList>;
  Calender: NavigatorScreenParams<CalenderStackNavParamsList>;
  Setting: NavigatorScreenParams<SettingStackNavParamsList>;
};

export type MainStackNavParamList = {
  BottomNav: NavigatorScreenParams<BottomTabNavParamList>;
  CustomerEdit: { customer: CustomerModel };
  ReportList: { customer: CustomerModel };
};

export type CustomerListStackNavParamsList = {
  CustomerListHome: undefined;
};

export type CalenderStackNavParamsList = {
  CalenderHome: undefined;
};

export type SettingStackNavParamsList = {
  SettingHome: undefined;
};
