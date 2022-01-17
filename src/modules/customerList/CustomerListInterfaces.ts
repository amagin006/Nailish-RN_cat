import CustomerModel, { ICustomer } from '~/modules/Customer/services/CusomerModels';
import { UserInterface } from '~/redux/user/types';
import firebase from 'firebase';

import '@firebase/firestore';
import { IMenuListItem } from '../Menu/MenuInterfaces';
import { IPickerItem } from '~/components/atoms/PickerModalAtom';

// Type
import { ITimeValue } from '~/components/molecules/EditDateTimeMolecules/EditTimeMolecules';
import { IDateValue } from '~/components/molecules/EditDateTimeMolecules/EditDateMolecules';

export interface CustomerListPresenterInterface {
  getCustomerList(user: UserInterface): Promise<ICustomerListItem[]>;
  getCustomerReportList(user: UserInterface, customerId: string): Promise<any[]>;
  upLoadImagePhoto(user: UserInterface, customerId?: string, imageUrl?: string): Promise<string>;
  updateCustomer(user: UserInterface, customer: ICustomer): Promise<void>;
  deleteCustomer(user: UserInterface, customerId?: string): Promise<boolean>;
  setNewReport(
    user: UserInterface,
    customerId: string,
    reportId: string,
    report?: ICustomerReport,
  ): Promise<boolean>;
  upLoadReportPhoto(
    user: UserInterface,
    customerId: string,
    imageUrl: string,
    reportId: string,
    photoIndex: number,
  ): Promise<string>;
  getNewReportKey(user: UserInterface, customerId: string): Promise<any>;
  getUploadReportPhotoUrls(
    user: UserInterface,
    customerId: string,
    reportPhotos: IReportPhoto[],
    reportId: string,
  ): Promise<(IReportPhoto | null)[]>;
}

export interface CustomerListRepositoryInterface {
  fetchCustomerList(user: UserInterface): Promise<ICustomerListItem[]>;
  getCustomerReportList(user: UserInterface, customerId: string): Promise<any[]>;
  upLoadImagePhoto(user: UserInterface, customerId?: string, imageUrl?: string): Promise<string>;
  updateCustomer(user: UserInterface, customer: ICustomer): Promise<void>;
  deleteCustomer(user: UserInterface, customerId?: string): Promise<boolean>;
  setNewReport(
    user: UserInterface,
    customerId: string,
    reportId: string,
    report?: ICustomerReport,
  ): Promise<boolean>;
  upLoadReportPhoto(
    user: UserInterface,
    customerId: string,
    imageUrl: string,
    reportId: string,
    photoIndex: number,
  ): Promise<string>;
  getNewReportKey(user: UserInterface, customerId: string): Promise<any>;
}

export interface ICustomerListItem {
  initial?: string;
  data: CustomerModel[];
}

export interface IReportPhoto {
  id: number | null;
  url: string;
}

export interface IReportListItem {
  user: ICustomer;
  report: ICustomerReport[];
}

export interface ICustomerReport {
  id?: string;
  photoUrls?: (IReportPhoto | null)[] | undefined;
  date: IDateValue;
  startEndtime: ITimeValue;
  selectedMenuItems: IMenuListItem[];
  tips: string;
  payment: IPickerItem;
  memo: string;
}
