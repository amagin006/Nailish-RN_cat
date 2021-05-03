import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import authReducer from '~/redux/auth/reducer';
import userReducer from '~/redux/user/reducer';
import customerReducer from './customer/reducer';

const reducers = combineReducers({
  auth: authReducer,
  user: userReducer,
  customer: customerReducer,
});

const store = createStore(reducers, applyMiddleware(thunk));

export default store;
