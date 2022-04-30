import { UserInterface } from '~/redux/user/types';
import { IMenuItem } from '../MenuInterfaces';
import { MenuRepository } from '../repository/MenuRepository';

interface MenuServices {
  addMenuItem: (user: UserInterface, menuItem: IMenuItem) => Promise<boolean>;
  deleteMenuItem: (user: UserInterface, menuItem: IMenuItem) => Promise<void>;
  updateMenuItem: (user: UserInterface, menuItem: IMenuItem) => Promise<void>;
  getMenuItemList: (user: UserInterface) => Promise<IMenuItem[]>;
}

export const MenuServices: MenuServices = {
  addMenuItem: async (user, menuItems) => {
    const isSuccess = await MenuRepository.addMenuItem(user, menuItems);
    console.log('presenter isSuccess', isSuccess);
    return isSuccess;
  },
  deleteMenuItem: async () => {},
  updateMenuItem: async () => {},
  getMenuItemList: async user => {
    const menuItems = await MenuRepository.getMenuItemList(user);
    return menuItems;
  },
};
