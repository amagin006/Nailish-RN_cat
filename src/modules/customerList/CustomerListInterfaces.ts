import CustomerModel, { ICustomer } from '~/modules/Customer/services/CusomerModels';
import { UserInterface } from '~/redux/user/types';
import firebase from 'firebase';

import '@firebase/firestore';
import { IMenuListItem } from '../Menu/MenuInterfaces';
import { ITimeValue } from '~/components/molecules/EditDateTimeMolecules/EditTimeMolecules';
import { IPickerItem } from '~/components/atoms/PickerModalAtom';

export interface CustomerListPresenterInterface {
  getCustomerList(user: UserInterface): Promise<ICustomerListItem[]>;
  upLoadPhoto(user: UserInterface, customerId?: string, imageUrl?: string): Promise<string>;
  updateCustomer(user: UserInterface, customer: ICustomer): Promise<void>;
  deleteCustomer(user: UserInterface, customerId?: string): Promise<boolean>;
  setNewReport(user: UserInterface, customerId: string, report: ICustmerReport): Promise<any>;
}

export interface CustomerListRepositoryInterface {
  fetchCustomerList(
    user: UserInterface,
  ): Promise<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>>;
  upLoadPhoto(user: UserInterface, customerId?: string, imageUrl?: string): Promise<string>;
  updateCustomer(user: UserInterface, customer: ICustomer): Promise<void>;
  deleteCustomer(user: UserInterface, customerId?: string): Promise<boolean>;
  setNewReport(user: UserInterface, customerId: string, report: ICustmerReport): Promise<any>;
}

export interface ICustomerListItem {
  initial?: string;
  data: CustomerModel[];
}

export interface IReportPhoto {
  id: string;
  url: string;
}

export interface IReportListItem {
  user: ICustomer;
  report: ICustmerReport[];
}

export interface ICustmerReport {
  id: string;
  date: string;
  startEndtime: ITimeValue;
  selectedMenuItems: IMenuListItem[];
  tips: string;
  payment: IPickerItem;
  memo: string;
}
