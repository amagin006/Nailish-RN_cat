import { ICustomer } from '~/modules/Customer/services/CusomerModels';
import { UserInterface } from '~/redux/user/types';
import { ICustomerListItem, ICustomerReport, IReportPhoto } from '../CustomerListInterfaces';
import { CustomerListRepository } from '../repository/CustomerListRepository';

interface CustmerListServices {
  /**
   * get customerList
   */
  getCustomerList(user: UserInterface): Promise<ICustomerListItem[]>;
  /**
   * get Customer report list
   */
  getCustomerReportList(user: UserInterface, customerId: string): Promise<any[]>;
  /**
   * upLoadImagePhoto
   */
  upLoadImagePhoto(user: UserInterface, customerId?: string, imageUrl?: string): Promise<string>;
  /**
   * updateCustomer
   */
  updateCustomer(user: UserInterface, customer: ICustomer): Promise<void>;
  /**
   * deleteCustomer
   */
  deleteCustomer(user: UserInterface, customerId: string): Promise<boolean>;
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

export const CustmerListServices: CustmerListServices = {
  getCustomerList: async (user: UserInterface) => {
    try {
      return await CustomerListRepository.fetchCustomerList(user);
    } catch (err) {
      console.log('Error firebase: ', err);
      return [];
    }
  },
  getCustomerReportList: async (user: UserInterface, customerId: string) => {
    try {
      return await CustomerListRepository.getCustomerReportList(user, customerId);
    } catch (err) {
      console.log('Error Firebase getCustomerReportList', err);
      return [];
    }
  },
  upLoadImagePhoto: async (user: UserInterface, customerId?: string, imageUrl?: string) => {
    const downloadURL = await CustomerListRepository.upLoadImagePhoto(user, customerId, imageUrl);
    return downloadURL;
  },
  updateCustomer: async (user: UserInterface, updateCustomer: ICustomer) => {
    await CustomerListRepository.updateCustomer(user, updateCustomer);
  },
  deleteCustomer: async (user: UserInterface, customerId: string) => {
    return await CustomerListRepository.deleteCustomer(user, customerId);
  },
  setNewReport: async (
    user: UserInterface,
    customerId: string,
    reportId: string,
    report?: ICustomerReport,
  ) => {
    return await CustomerListRepository.setNewReport(user, customerId, reportId, report);
  },
  updateReport: async (
    user: UserInterface,
    customerId: string,
    reportId: string,
    report: ICustomerReport,
  ) => {
    return await CustomerListRepository.updateReport(user, customerId, reportId, report);
  },
  deleteReport: async (
    user: UserInterface,
    customerId: string,
    reportId: string,
  ): Promise<boolean> => {
    return await CustomerListRepository.deleteReport(user, customerId, reportId);
  },
  upLoadReportPhoto: async (
    user: UserInterface,
    customerId: string,
    imageUrl: string,
    reportId: string,
    photoIndex: number,
  ) => {
    const downloadURL = await CustomerListRepository.upLoadReportPhoto(
      user,
      customerId,
      imageUrl,
      reportId,
      photoIndex,
    );
    return downloadURL;
  },
  getUploadReportPhotoUrls: async (
    user: UserInterface,
    customerId: string,
    reportPhotos: IReportPhoto[],
    reportId: string,
  ) => {
    // Upload firebase storage and Get photo url from firebase storage
    const photoUrls: IReportPhoto[] = await Promise.all(
      reportPhotos.map(async (photo, index) => {
        if ((photo.id || photo.id === 0) && photo.url?.startsWith('http')) {
          // already uploaded photo on fire storage
          return photo;
        } else if ((photo.id || photo.id === 0) && !!photo.url) {
          // need to upload fire storage
          const photoRes = await CustomerListRepository.upLoadReportPhoto(
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
  getNewReportKey: async (user: UserInterface, customerId: string) => {
    return await CustomerListRepository.getNewReportKey(user, customerId);
  },
};
