import { ICustomerListItem } from '~/modules/Customer/CustomerListInterfaces';
import CustomerModel from '~/modules/Customer/CustomerModels';
import {
  SELECTED_CUSTOMER,
  SAVE_CUSTOMERLIST,
  ADD_CUSTOMER_TO_LIST,
  DELETE_CUSTOMER,
} from '~/redux/customer/types';

export const selectedCustomer = (customer?: CustomerModel) => {
  return {
    type: SELECTED_CUSTOMER,
    payload: customer,
  };
};

export const saveCustomerList = (customerList: ICustomerListItem[]) => {
  return {
    type: SAVE_CUSTOMERLIST,
    payload: customerList,
  };
};

export const addCustomerToList = (customer: CustomerModel) => {
  return {
    type: ADD_CUSTOMER_TO_LIST,
    payload: customer,
  };
};

export const deleteCustomer = (customer: CustomerModel) => {
  return {
    type: DELETE_CUSTOMER,
    payload: customer,
  };
};
