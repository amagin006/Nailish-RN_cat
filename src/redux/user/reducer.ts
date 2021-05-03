import { AnyAction } from 'redux';
import { USER_SET, USER_UN_SET } from '~/redux/user/types';

interface IUserState {
  uid: string | null;
}

const initialState: IUserState = {
  uid: null,
};

const reducer = (state = initialState, action: AnyAction) => {
  // console.log('reducer-User---', action);
  switch (action.type) {
    case USER_SET:
      return {
        ...state,
        uid: action.payload.uid,
      };
    case USER_UN_SET:
      return {
        ...state,
        uid: null,
      };
    default:
      return state;
  }
};

export default reducer;
