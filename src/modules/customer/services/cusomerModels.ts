import BaseModel from '~/modules/bases/models/BaseModel';
/**
 * Customer Model
 */
export default class CustomerModel extends BaseModel {
  public id: string = '';
  public firstLetter: string = '';
  public firstName: string = '';
  public lastName: string = '';
  public profileImg: string = '';
  public instagram: string = '';
  public mail: string = '';
  public birthday: string = '';
  public memo: string = '';
  public mobile: string = '';
  public twitter: string = '';
  public lastVisit: string = '';

  /**
   * has already set user or not
   * @return {boolean} true = already set user, false = not set user yet
   */
  public isSetUser = (): boolean => {
    if (this.id === undefined || this.id === null || this.id === '') return true;
    return false;
  };

  constructor(init?: Partial<CustomerModel>) {
    super();

    if (init === undefined || init === null) return;

    Object.assign(this, init);
  }

  /**
   * set
   *
   * @param init
   */
  public set = (init?: Partial<CustomerModel>) => {
    Object.assign(this, init);
  };
}

export interface ICustomer {
  id: string;
  firstLetter: string;
  firstName?: string;
  lastName?: string;
  birthday?: string;
  mobile?: string;
  mail?: string;
  instagram?: string;
  twitter?: string;
  memo?: string;
  profileImg?: string;
  lastVisit?: string;
}
