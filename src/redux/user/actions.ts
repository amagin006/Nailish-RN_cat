import { USER_SET, USER_UN_SET } from '~/redux/user/types';

export const userSet = user => {
  return {
    type: USER_SET,
    payload: user,
  };
};

export const userUnSet = () => {
  // console.log('userUnSet-----------action');
  return {
    type: USER_UN_SET,
  };
};
