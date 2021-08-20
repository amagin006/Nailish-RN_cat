import { UserInterface } from '~/redux/user/types';

export interface MenuPresenterInterface {
  addMenuItem: (user: UserInterface, menuItem: IMenuItem) => Promise<boolean>;
  deleteMenuItem: (user: UserInterface, menuItem: IMenuItem) => Promise<void>;
  updateMenuItem: (user: UserInterface, menuItem: IMenuItem) => Promise<void>;
  getMenuItemList: (user: UserInterface) => Promise<void>;
}

export interface MenuRepositoryInterface {
  addMenuItem: (user: UserInterface, menuItem: IMenuItem) => Promise<boolean>;
  deleteMenuItem: (user: UserInterface, menuItem: IMenuItem) => Promise<void>;
  updateMenuItem: (user: UserInterface, menuItem: IMenuItem) => Promise<void>;
  getMenuItemList: (user: UserInterface) => Promise<void>;
}

export interface IMenuItem {
  id?: string;
  menuName: string;
  color: string;
  price: string;
}
