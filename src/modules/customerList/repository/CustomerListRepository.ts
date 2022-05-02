import { ICustomerReport, ICustomerListItem } from '~/modules/CustomerList/CustomerListInterfaces';

import { db } from '~/config/Firebase';
import firebase from '~/config/Firebase';
import CustomerModel, { ICustomer } from '~/modules/Customer/services/CustomerModels';
import { UserInterface } from '~/redux/user/types';

interface CustomerListRepository {
  fetchCustomerList: (user: UserInterface) => Promise<ICustomerListItem[]>;
  getCustomerReportList: (user: UserInterface, customerId: string) => Promise<any[]>;
  /**
   * upLoadImagePhoto
   */
  upLoadImagePhoto: (
    user: UserInterface,
    customerId?: string,
    imageUrl?: string,
  ) => Promise<string>;
  /**
   * updateCustomer
   */
  updateCustomer: (user: UserInterface, customer: ICustomer) => Promise<void>;
  /**
   * deleteCustomer
   */
  deleteCustomer: (user: UserInterface, customerId: string) => Promise<boolean>;
  /**
   * create Custom Report
   */
  setNewReport: (
    user: UserInterface,
    customerId: string,
    reportId: string,
    report?: ICustomerReport,
  ) => Promise<boolean>;
  /**
   * Update cutomer report
   */
  updateReport: (
    user: UserInterface,
    customerId: string,
    reportId: string,
    report: ICustomerReport,
  ) => Promise<boolean>;
  /**
   * Delete customer report
   */
  deleteReport: (user: UserInterface, customerId: string, reportId: string) => Promise<boolean>;
  /**
   * upLoadImagePhoto
   */
  upLoadReportPhoto: (
    user: UserInterface,
    customerId: string,
    imageUrl: string,
    reportId: string,
    photoIndex: number,
  ) => Promise<string>;
  /**
   * To get customer uniqu report key for firebase collection
   */
  getNewReportKey: (user: UserInterface, customerId: string) => Promise<any>;
}

export const CustomerListRepository: CustomerListRepository = {
  fetchCustomerList: async user => {
    try {
      const data = await db
        .collection('users')
        .doc(`${user.uid}`)
        .collection('customer')
        .orderBy('firstName')
        .get();

      let newCustomerList: ICustomerListItem[] = [];
      data.forEach(doc => {
        const id = doc.id;
        const newCustomer = new CustomerModel({ id, ...doc.data() });

        if (newCustomerList.length === 0) {
          newCustomerList.push({ initial: newCustomer.firstLetter, data: [newCustomer] });
        } else {
          let findRow;
          newCustomerList.map(row => {
            if (row.initial === newCustomer.firstLetter) {
              row?.data && row.data.push(newCustomer);
              findRow = true;
              return;
            }
          });
          !findRow &&
            newCustomerList.push({ initial: newCustomer.firstLetter, data: [newCustomer] });
        }
      });
      return newCustomerList || [];
    } catch (err) {
      console.log('Error fetchCustomerList: ', err);
      throw new Error('Error fetchCustomerList on CustomerListRepository');
    }
  },
  getCustomerReportList: async (user, customerId) => {
    try {
      const dataRef = db
        .collection('users')
        .doc(`${user.uid}`)
        .collection('report')
        .where('customerId', '==', customerId);

      const data = await dataRef.orderBy('date.dateString').get();

      const newReportList: ICustomerReport[] = [];
      data.forEach(doc => {
        const dataID = doc.data() as ICustomerReport;
        newReportList.push(dataID);
      });
      console.log('newReportList', newReportList);
      return newReportList;
    } catch (err) {
      console.log('Error fetchCustomerReportList: ', err);
      throw new Error('Error fetchCustomerReportList on CustomerListRepository');
    }
  },
  upLoadImagePhoto: async (user, customerId, imageUrl) => {
    const metadata = {
      contentType: 'image/jpeg',
    };
    const storage = firebase.storage();
    if (!imageUrl || !customerId) {
      console.log('Error imageUri or customerId is invalid', imageUrl);
      throw new Error('Error upLoadImagePhoto on CustomerListRepository');
    }
    if (!imageUrl.indexOf('https://')) {
      console.log('no imageURL file://');
      return new Promise<string>(resolve => resolve(''));
    }
    const imgURI = imageUrl;
    let blob: Blob | Uint8Array | ArrayBuffer;
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
  },
  updateCustomer: async (user, updateCustomer) => {
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
  },
  deleteCustomer: async (user, customerId) => {
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
  },
  setNewReport: async (user, customerId, reportId, report) => {
    if (!report) {
      console.log('Error customer Report is undifined');
      return false;
    }
    try {
      const reportRef = db
        .collection('users')
        .doc(`${user.uid}`)
        .collection('report')
        .doc(`${reportId}`);

      await reportRef.set(report);
      return true;
    } catch (err) {
      console.log('Error Document fali set New Report: ', err);
      return false;
    }
  },
  updateReport: async (user, customerId, reportId, report): Promise<boolean> => {
    try {
      const reportRef = db
        .collection('users')
        .doc(`${user.uid}`)
        .collection('report')
        .doc(`${reportId}`);
      await reportRef.set(report);
      console.log('report successfully deleted! from firebaseDatabase', customerId, reportId);
      return true;
    } catch (err) {
      console.log('Error deleteReport - firebase database on CustomerListRepository ', err);
      return false;
    }
  },
  deleteReport: async (
    user: UserInterface,
    customerId: string,
    reportId: string,
  ): Promise<boolean> => {
    // delete report from firebase database
    try {
      await db
        .collection('users')
        .doc(`${user.uid}`)
        .collection('report')
        .doc(`${reportId}`)
        .delete();
      console.log('report successfully deleted! from firebaseDatabase', customerId, reportId);
    } catch (err) {
      console.log('Error deleteReport - firebase database on CustomerListRepository ', err);
      return false;
    }

    // delete photo from firebase strage
    try {
      const storage = firebase.storage();
      const storageRef = storage
        .ref('user')
        .child(`${user.uid}/customers/${customerId}/${reportId}`);
      const photoAllList = await storageRef.listAll(); // get all photo file on report directory
      const promises = photoAllList.items.map(item => item.delete()); // delete func return promise
      Promise.all(promises); // resoleve all
      console.log('image successfully deleted! from storage');
    } catch (err) {
      console.log('Error deleteReport - storage on CustomerListRepository ', err);
      return false;
    }

    console.log('deleteReport --- Report successfully deleted!');
    return true;
  },
  upLoadReportPhoto: async (user, customerId, imageUrl, reportId, photoIndex) => {
    const metadata = {
      contentType: 'image/jpeg',
    };
    const storage = firebase.storage();
    if (!imageUrl || !customerId) {
      console.log('Error imageUri or customerId is invalid', imageUrl);
      throw new Error('Error upLoadReportPhoto on CustomerListRepository');
    }
    if (!imageUrl.indexOf('https://')) {
      console.log('no imageURL file://');
      return new Promise<string>(resolve => resolve(''));
    }
    const imgURI = imageUrl;
    let blob: Blob | Uint8Array | ArrayBuffer;
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
        // .child(`${user.uid}/customers/${customerId}/${reportId}/report_${photoIndex}`);
        .child(`${user.uid}/customers/${customerId}/${reportId}/report_${photoIndex}`);
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
  },
  getNewReportKey: async (user, customerId) => {
    const newPostKey = firebase.database().ref(`${user.uid}/report/`).push().key;
    console.log('newPostKey', newPostKey);
    return newPostKey;
  },
};
