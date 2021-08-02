import BaseRepository from '~/modules/bases/models/BaseRepository';
import { CustomerListRepositoryInterface } from '~/modules/CustomerList/CustomerListInterfaces';

import { db } from '~/config/Firebase';
import firebase from '~/config/Firebase';
import CustomerModel from '~/modules/Customer/services/CusomerModels';

export default class CustomerListRepository
  extends BaseRepository
  implements CustomerListRepositoryInterface
{
  constructor() {
    super();
  }

  public async fetchCustomerList(user) {
    try {
      return await db
        .collection('users')
        .doc(`${user.uid}`)
        .collection('customer')
        .orderBy('firstName')
        .get();
    } catch (err) {
      console.log('Error fetchCustomerList: ', err);
      throw new Error('Error fetchCustomerList on CustomerListRepository');
    }
  }

  /**
   * upLoadPhoto
   */
  public async upLoadPhoto(user, customerId, imageUrl) {
    const metadata = {
      contentType: 'image/jpeg',
    };
    const storage = firebase.storage();
    if (!imageUrl || !customerId) {
      console.log('Error imageUri or customerId is invalid', imageUrl);
      throw new Error('Error upLoadPhoto on CustomerListRepository');
    }
    if (!imageUrl.indexOf('https://')) {
      console.log('no imageURL file://');
      return new Promise<string>(resolve => resolve(''));
    }
    const imgURI = imageUrl;
    let blob;
    try {
      const response = await fetch(imgURI);
      console.log('response', response);
      blob = await response.blob();
      console.log('blob', blob);
    } catch (err) {
      console.log('Error to blob: ', err);
    }
    const uploadProsess = new Promise<string>(function (resolve, reject) {
      const uploadRef = storage
        .ref('user')
        .child(`${user.uid}/customers/${customerId}/profile_img`);
      const uploadTask = uploadRef.put(blob, metadata);
      uploadTask.on(
        'state_changed',
        snapshot => {
          let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // setProgress(progress);
          console.log('progress');
        },
        err => {
          console.log('Error uploadTask: ', err);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((URL: string) => {
            resolve(URL);
          });
        },
      );
    });
    return uploadProsess;
  }

  /**
   * updateCustomer
   */
  public async updateCustomer(user, updateCustomer) {
    const customerRef = db
      .collection('users')
      .doc(`${user.uid}`)
      .collection('customer')
      .doc(`${updateCustomer.id}`);
    try {
      await customerRef.update(updateCustomer);
    } catch (err) {
      console.log('Error update image', err);
    }
  }

  /**
   * deleteCustomer
   */
  public async deleteCustomer(user, customerId) {
    console.log('customerId', customerId);
    if (!customerId) {
      console.log('Error delete customer is undifined');
      return false;
    }
    try {
      await db
        .collection('users')
        .doc(`${user.uid}`)
        .collection('customer')
        .doc(`${customerId}`)
        .delete();
      console.log('Document successfully deleted! customerId', customerId);
      return true;
    } catch (err) {
      console.log('Error deleteCustomer on CustomerListRepository ', err);
      return false;
    }
  }
}
