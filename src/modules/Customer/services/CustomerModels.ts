/**
 * Customer Model
 */
export default class CustomerModel {
  public id: string = '';
  public firstLetter: string = '';
  public firstName: string = '';
  public lastName: string | undefined = '';
  public profileImg: string | null = '';
  public instagram: string | undefined = '';
  public mail: string | undefined = '';
  public birthday: string | undefined = '';
  public memo: string | undefined = '';
  public mobile: string | undefined = '';
  public twitter: string | undefined = '';
  public lastVisit: string | undefined = '';

  /**
   * has already set user or not
   * @return {boolean} true = already set user, false = not set user yet
   */
  public isSetUser = (): boolean => {
    if (this.id === undefined || this.id === null || this.id === '') return true;
    return false;
  };

  constructor(init?: Partial<CustomerModel>) {
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
  profileImg: string | null;
  lastVisit?: string;
}
