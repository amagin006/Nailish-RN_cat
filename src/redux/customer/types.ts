import CustomerModel from '~/modules/Customer/CustomerModels';
import { ICustomerListItem } from '~/modules/Customer/CustomerListInterfaces';

export const SELECTED_CUSTOMER = 'SELECTED_CUSTOMER';
export const SAVE_CUSTOMERLIST = 'SAVE_CUSTOMERLIST';
export const ADD_CUSTOMER_TO_LIST = 'ADD_CUSTOMER_TO_LIST';
export const DELETE_CUSTOMER = 'DELETE_CUSTOMER';

export interface ICustomerStore {
  customerList: ICustomerListItem[];
  selectedCustomer?: CustomerModel;
}
