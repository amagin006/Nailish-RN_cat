import BasePresenter from '~/modules/bases/models/BasePresenter';
import {
  ICustomerListItem,
  CustomerListPresenterInterface,
  CustomerListRepositoryInterface,
  ICustmerReport,
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
      let newCustomerList: ICustomerListItem[] = [];
      const data = await this.CustomerListRepository.fetchCustomerList(user);
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
      console.log('Error firebase: ', err);
      return [];
    }
  };

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
    report?: ICustmerReport,
  ) {
    return await this.CustomerListRepository.setNewReport(user, customerId, reportId, report);
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
    const photoUrls: (IReportPhoto | null)[] = await Promise.all(
      reportPhotos.map(async (photo, index) => {
        if (photo.id || photo.id === 0) {
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
          return null;
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
