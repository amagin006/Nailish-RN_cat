import { ICustomerListItem } from '~/modules/customerList/CustomerListInterfaces';

export const SAVE_CUSTOMERLIST = 'SAVE_CUSTOMERLIST';
export const ADD_CUSTOMER_TO_LIST = 'ADD_CUSTOMER_TO_LIST';
export const DELETE_CUSTOMER = 'DELETE_CUSTOMER';

export interface ICustomerStore {
  customerList: ICustomerListItem[];
}
