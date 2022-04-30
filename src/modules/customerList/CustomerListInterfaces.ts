import CustomerModel, { ICustomer } from '~/modules/Customer/services/CusomerModels';

import { IMenuListItem } from '../Menu/MenuInterfaces';
import { IPickerItem } from '~/components/atoms/PickerModalAtom';

// Type
import { ITimeValue } from '~/components/molecules/EditDateTimeMolecules/EditTimeMolecules';
import { IDateValue } from '~/components/molecules/EditDateTimeMolecules/EditDateMolecules';

export interface ICustomerListItem {
  initial?: string;
  data: CustomerModel[];
}

export interface IReportPhoto {
  id: number | null;
  url: string | null;
}

export interface IReportListItem {
  user: ICustomer;
  report: ICustomerReport[];
}

export interface ICustomerReport {
  id?: string;
  photoUrls: IReportPhoto[];
  date: IDateValue;
  startEndtime: ITimeValue;
  selectedMenuItems: IMenuListItem[];
  tips: string;
  payment: IPickerItem;
  memo: string;
  customerId: string;
  customerFirstName: string;
  customerLastName: string;
}
