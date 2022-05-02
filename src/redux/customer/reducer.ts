import CustomerModel from '~/modules/Customer/services/CustomerModels';
import {
  SELECTED_CUSTOMER,
  SAVE_CUSTOMERLIST,
  ADD_CUSTOMER_TO_LIST,
  DELETE_CUSTOMER,
  ICustomerStore,
} from '~/redux/customer/types';

const initialState: ICustomerStore = {
  customerList: [],
  selectedCustomer: undefined,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SELECTED_CUSTOMER:
      return {
        ...state,
        selectedCustomer: action.payload,
      };
    case SAVE_CUSTOMERLIST:
      return {
        ...state,
        customerList: action.payload,
      };
    case ADD_CUSTOMER_TO_LIST:
      const addCustomer: CustomerModel = action.payload;
      if (!addCustomer || !(addCustomer instanceof CustomerModel)) return;

      let row = state.customerList.find(row => row.initial === addCustomer.firstLetter);
      let newCustomerList: ICustomerStore = state;

      if (row) {
        // if there is a name row
        if (Array.isArray(row.data)) {
          row.data.push(addCustomer);
        } else {
          row.data = [addCustomer];
        }

        row.data.sort((a, b) => {
          const nameA = a.firstName.toLowerCase();
          const nameB = b.firstName.toLowerCase();
          return nameA > nameB ? 1 : nameA < nameB ? -1 : 0;
        });

        newCustomerList.customerList = state.customerList.map(listRow => {
          if (listRow.initial === row?.initial) {
            return row!;
          }
          return listRow;
        });
      } else {
        // add New customer row
        row = {
          initial: addCustomer.firstLetter,
          data: [addCustomer],
        };
        state.customerList.push(row);
        state.customerList.sort((a, b) => {
          const rowAInitial = a.initial || '#';
          const rowBInitial = b.initial || '#';
          return rowAInitial > rowBInitial ? 1 : rowAInitial < rowBInitial ? -1 : 0;
        });
        newCustomerList = { ...state };
      }

      return {
        ...newCustomerList,
      };

    case DELETE_CUSTOMER:
      const deleteCustomer: CustomerModel = action.payload;
      const deleteRow = state.customerList.map(row => {
        let newData = row.data;
        if (row.initial === deleteCustomer.firstLetter) {
          newData = row.data.filter(item => item.id !== deleteCustomer.id);
        }
        return {
          initial: row.initial,
          data: newData,
        };
      });

      return {
        ...state,
        customerList: deleteRow,
      };
    default:
      return state;
  }
};

export default reducer;
