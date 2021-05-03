import { CUSTOMERLIST_LOADING } from '~/redux/customer/types';

const initialState = {
  isFetching: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CUSTOMERLIST_LOADING:
      return {
        isFetching: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
