import { createStore, combineReducers, applyMiddleware, Action } from 'redux';

import thunk from 'redux-thunk';
import { ThunkAction } from 'redux-thunk';

import authReducer from '~/redux/auth/reducer';
import userReducer from '~/redux/user/reducer';
import customerReducer from './customer/reducer';

const reducers = combineReducers({
  auth: authReducer,
  user: userReducer,
  customer: customerReducer,
});

const store = createStore(reducers, applyMiddleware(thunk));

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export default store;
