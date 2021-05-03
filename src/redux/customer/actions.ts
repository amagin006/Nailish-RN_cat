import { CUSTOMERLIST_LOADING } from '~/redux/customer/types';

export const customerLoad = isFetching => {
  // console.log('cutomerLoad', isFetching);
  return {
    type: CUSTOMERLIST_LOADING,
    payload: isFetching,
  };
};
