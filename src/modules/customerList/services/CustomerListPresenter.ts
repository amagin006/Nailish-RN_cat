import BasePresenter from '~/modules/bases/models/BasePresenter';
import {
  ICustomerListItem,
  CustomerListPresenterInterface,
  CustomerListRepositoryInterface,
  ICustomerReport,
  IReportPhoto,
} from '~/modules/CustomerList/CustomerListInterfaces';

import CustomerModel, { ICustomer } from '~/modules/Customer/services/CusomerModels';
import { UserInterface } from '~/redux/user/types';

export default class CustomerListPresenter
  extends BasePresenter
  implements CustomerListPresenterInterface
{
  private CustomerListRepository: CustomerListRepositoryInterface;

  // constructor
  constructor(customerListRepository: CustomerListRepositoryInterface) {
    super();
    this.CustomerListRepository = customerListRepository;
  }

  /**
   * get customerList
   */
  public getCustomerList = async (user: UserInterface) => {
    try {
      return await this.CustomerListRepository.fetchCustomerList(user);
    } catch (err) {
      console.log('Error firebase: ', err);
      return [];
    }
  };

  /**
   * get Customer report list
   */

  public async getCustomerReportList(user: UserInterface, customerId: string) {
    try {
      return await this.CustomerListRepository.getCustomerReportList(user, customerId);
    } catch (err) {
      console.log('Error Firebase getCustomerReportList', err);
      return [];
    }
  }

  /**
   * upLoadImagePhoto
   */
  public async upLoadImagePhoto(user: UserInterface, customerId?: string, imageUrl?: string) {
    const downloadURL = await this.CustomerListRepository.upLoadImagePhoto(
      user,
      customerId,
      imageUrl,
    );
    return downloadURL;
  }

  /**
   * updateCustomer
   */
  public async updateCustomer(user: UserInterface, updateCustomer: ICustomer) {
    await this.CustomerListRepository.updateCustomer(user, updateCustomer);
  }

  /**
   * deleteCustomer
   */
  public async deleteCustomer(user: UserInterface, customerId: string) {
    return await this.CustomerListRepository.deleteCustomer(user, customerId);
  }

  /**
   * create Custom Report
   */
  public async setNewReport(
    user: UserInterface,
    customerId: string,
    reportId: string,
    report?: ICustomerReport,
  ) {
    return await this.CustomerListRepository.setNewReport(user, customerId, reportId, report);
  }

  /**
   * Delete customer Report
   */
  public async updateReport(
    user: UserInterface,
    customerId: string,
    reportId: string,
    report: ICustomerReport,
  ) {
    return await this.CustomerListRepository.updateReport(user, customerId, reportId, report);
  }

  /**
   * Delete customer Report
   */
  public async deleteReport(
    user: UserInterface,
    customerId: string,
    reportId: string,
  ): Promise<boolean> {
    return await this.CustomerListRepository.deleteReport(user, customerId, reportId);
  }

  /**
   * upLoad one ReportPhoto to firebase storage
   */
  public async upLoadReportPhoto(
    user: UserInterface,
    customerId: string,
    imageUrl: string,
    reportId: string,
    photoIndex: number,
  ) {
    const downloadURL = await this.CustomerListRepository.upLoadReportPhoto(
      user,
      customerId,
      imageUrl,
      reportId,
      photoIndex,
    );
    return downloadURL;
  }

  public async getUploadReportPhotoUrls(
    user: UserInterface,
    customerId: string,
    reportPhotos: IReportPhoto[],
    reportId: string,
  ) {
    // Upload firebase storage and Get photo url from firebase storage
    const photoUrls: IReportPhoto[] = await Promise.all(
      reportPhotos.map(async (photo, index) => {
        if ((photo.id || photo.id === 0) && photo.url?.startsWith('http')) {
          // already uploaded photo on fire storage
          return photo;
        } else if ((photo.id || photo.id === 0) && !!photo.url) {
          // need to upload fire storage
          const photoRes = await this.upLoadReportPhoto(
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
  }

  /**
   * To get customer uniqu report key for firebase collection
   */
  public async getNewReportKey(user: UserInterface, customerId: string) {
    return await this.CustomerListRepository.getNewReportKey(user, customerId);
  }
}
