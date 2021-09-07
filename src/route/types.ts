import { NavigatorScreenParams } from '@react-navigation/native';
import { IMenuItem } from '~/modules/Menu/MenuInterfaces';

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
  CustomerEdit: undefined;
  ReportList: undefined;
  ReportDetail: { appointItem: any };
  ReportEdit: undefined;

  EditAppointment: { item: any } | undefined;
  SelectMenuListScreen: { updateItems: boolean } | undefined;
  AddEditMenuItemScreen: { menuItem: IMenuItem } | undefined;
};

export type CustomerListStackNavParamsList = {
  CustomerListHome: undefined;
};

export type CalenderStackNavParamsList = {
  CalenderHome: { onSavePress: () => void };
};

export type SettingStackNavParamsList = {
  SettingHome: undefined;
};
