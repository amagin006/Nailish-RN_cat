import CustomerModel, { ICustomer } from '~/modules/Customer/CustomerModels';
import { UserInterface } from '~/redux/user/types';
import { ICustomerListItem, ICustomerReport, IReportPhoto } from '../CustomerListInterfaces';
import { CustomerRepository } from '../repository/CustomerRepository';

interface CustomerServices {
  /**
   * get customer info
   */
  getCustomer: (user: UserInterface, customerId: string) => Promise<CustomerModel | null>;
  /**
   * get customerList
   */
  getCustomerList: (user: UserInterface) => Promise<ICustomerListItem[]>;
  /**
   * get Customer report list
   */
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
  setNewReport(
    user: UserInterface,
    customerId: string,
    reportId: string,
    report?: ICustomerReport,
  ): Promise<boolean>;
  updateReport(
    user: UserInterface,
    customerId: string,
    reportId: string,
    report: ICustomerReport,
  ): Promise<boolean>;
  /**
   * Delete customer Report
   */
  deleteReport(user: UserInterface, customerId: string, reportId: string): Promise<boolean>;
  /**
   * upLoad one ReportPhoto to firebase storage
   */
  upLoadReportPhoto(
    user: UserInterface,
    customerId: string,
    imageUrl: string,
    reportId: string,
    photoIndex: number,
  ): Promise<string>;
  getNewReportKey(user: UserInterface, customerId: string): Promise<any>;
  /**
   * To get customer uniqu report key for firebase collection
   */
  getUploadReportPhotoUrls(
    user: UserInterface,
    customerId: string,
    reportPhotos: IReportPhoto[],
    reportId: string,
  ): Promise<IReportPhoto[]>;
}

export const CustomerServices: CustomerServices = {
  getCustomer: async (user, customerId) => {
    return await CustomerRepository.getCustomer(user, customerId);
  },
  getCustomerList: async user => {
    try {
      return await CustomerRepository.fetchCustomerList(user);
    } catch (err) {
      console.log('Error firebase: ', err);
      return [];
    }
  },
  getCustomerReportList: async (user, customerId) => {
    try {
      return await CustomerRepository.getCustomerReportList(user, customerId);
    } catch (err) {
      console.log('Error Firebase getCustomerReportList', err);
      return [];
    }
  },
  upLoadImagePhoto: async (user, customerId, imageUrl) => {
    const downloadURL = await CustomerRepository.upLoadImagePhoto(user, customerId, imageUrl);
    return downloadURL;
  },
  updateCustomer: async (user, updateCustomer) => {
    await CustomerRepository.updateCustomer(user, updateCustomer);
  },
  deleteCustomer: async (user, customerId) => {
    return await CustomerRepository.deleteCustomer(user, customerId);
  },
  setNewReport: async (user, customerId, reportId, report) => {
    return await CustomerRepository.setNewReport(user, customerId, reportId, report);
  },
  updateReport: async (user, customerId, reportId, report) => {
    return await CustomerRepository.updateReport(user, customerId, reportId, report);
  },
  deleteReport: async (user, customerId, reportId) => {
    return await CustomerRepository.deleteReport(user, customerId, reportId);
  },
  upLoadReportPhoto: async (user, customerId, imageUrl, reportId, photoIndex) => {
    const downloadURL = await CustomerRepository.upLoadReportPhoto(
      user,
      customerId,
      imageUrl,
      reportId,
      photoIndex,
    );
    return downloadURL;
  },
  getUploadReportPhotoUrls: async (user, customerId, reportPhotos, reportId) => {
    // Upload firebase storage and Get photo url from firebase storage
    const photoUrls: IReportPhoto[] = await Promise.all(
      reportPhotos.map(async (photo, index) => {
        if ((photo.id || photo.id === 0) && photo.url?.startsWith('http')) {
          // already uploaded photo on fire storage
          return photo;
        } else if ((photo.id || photo.id === 0) && !!photo.url) {
          // need to upload fire storage
          const photoRes = await CustomerRepository.upLoadReportPhoto(
            user,
            customerId,
            photo.url,
            reportId,
            index,
          );
          const photoInfo: IReportPhoto = {
            id: index,
            url: photoRes,
          };
          return photoInfo;
        } else {
          // initial photo
          const photoInfo: IReportPhoto = {
            id: index,
            url: null,
          };
          return photoInfo;
        }
      }),
    );
    return photoUrls;
  },
  getNewReportKey: async (user, customerId) => {
    return await CustomerRepository.getNewReportKey(user, customerId);
  },
};
