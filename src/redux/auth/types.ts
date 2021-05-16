export const CREATE_USER = 'CREATE_USER';
export const CREATE_USER_FAILED = 'CREATE_USER_FAILED';
export const LOADING_LOGIN = 'LOADING_LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILED = 'LOGIN_FAILED';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

export const FAILED_CONFIRM = 'FAILED_CONFIRM';

export interface AuthState {
  isLogin?: boolean;
  isLoadingLogin?: boolean;
  isCreateFailed?: boolean;
  createFailedMessage?: string;
  loginFailedMessage?: string;
}
