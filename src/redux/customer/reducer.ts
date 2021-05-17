import CustomerModel from '~/modules/customer/services/cusomerModels';
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
      const customer: CustomerModel = action.payload;
      if (!customer || !(customer instanceof CustomerModel)) return;

      let row = state.customerList.find(row => row.initial === customer.firstLetter);
      let newCustomerList: ICustomerStore = state;

      if (row) {
        // if there is a name row
        if (Array.isArray(row.data)) {
          row.data.push(customer);
        } else {
          row.data = [customer];
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
          initial: customer.firstLetter,
          data: [customer],
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
    // return {
    //   ...state,
    //   customerList:
    // }
    default:
      return state;
  }
};

export default reducer;
