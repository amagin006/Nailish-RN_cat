import { NavigatorScreenParams } from '@react-navigation/native';
// Type
import { ICustomerListItem, ICustomerReport } from '~/modules/CustomerList/CustomerListInterfaces';
import { IMenuItem, IMenuListItem } from '~/modules/Menu/MenuInterfaces';

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
  ReportList: { reload: boolean } | undefined;
  ReportDetail: { appointItem: ICustomerReport };
  NewReportAndEdit:
    | { selectedMenuItems?: IMenuListItem[]; appointItem?: ICustomerReport }
    | undefined;

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
