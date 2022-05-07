import {
  CREATE_USER,
  CREATE_USER_FAILED,
  LOGIN_SUCCESS,
  LOADING_LOGIN,
  LOGIN_FAILED,
  LOGOUT_SUCCESS,
  FAILED_CONFIRM,
  AuthState,
} from '~/redux/auth/types';

const initialState: AuthState = {
  isLogin: false,
  isLoadingLogin: false,
  isCreateFailed: false,
  createFailedMessage: '',
  loginFailedMessage: '',
};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case CREATE_USER:
      return {
        ...state,
        isLogin: true,
        isLoadingLogin: false,
      };
    case CREATE_USER_FAILED:
      return {
        ...state,
        isLoadingLogin: false,
        createFailedMessage: action.payload,
      };
    case FAILED_CONFIRM:
      return {
        ...state,
        createFailedMessage: '',
        loginFailedMessage: '',
      };
    case LOGIN_SUCCESS:
      // console.log('LOGIN_SUCCESS', action);
      return {
        ...state,
        isLogin: true,
        isLoadingLogin: false,
      };
    case LOGIN_FAILED:
      // console.log('LOGIN_FAILED', action);
      return {
        ...state,
        isLoadingLogin: false,
        loginFailedMessage: 'Login failed',
      };
    case LOGOUT_SUCCESS:
      // console.log('LOGOUT_SUCCESS');
      return {
        isLogin: false,
      };
    case LOADING_LOGIN:
      // console.log('LOADING_LOGIN');
      return {
        ...state,
        isLoadingLogin: true,
      };
    default:
      return state;
  }
};

export default reducer;
