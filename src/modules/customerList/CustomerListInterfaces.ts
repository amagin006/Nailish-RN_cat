import CustomerModel from '~/modules/customer/services/cusomerModels';
import { UserInterface } from '~/redux/user/types';
import firebase from 'firebase';

import '@firebase/firestore';

export interface CustomerListPresenterInterface {
  getCustomerList(user: UserInterface): Promise<ICustomerListItem[]>;
}

export interface CustomerListRepositoryInterface {
  fetchCustomerList(
    user: UserInterface,
  ): Promise<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>>;
}

export interface ICustomerListItem {
  initial?: string;
  data: CustomerModel[];
}
