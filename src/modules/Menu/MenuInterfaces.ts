export interface MenuPresenterInterface {
  addMenuItem: () => Promise<void>;
  deleteMenuItem: () => Promise<void>;
  editMenuItem: () => Promise<void>;
  getMenuItemList: () => Promise<void>;
}

export interface MenuRepositoryInterface {
  addMenuItem: () => Promise<void>;
  deleteMenuItem: () => Promise<void>;
  editMenuItem: () => Promise<void>;
  getMenuItemList: () => Promise<void>;
}

export interface IMenuItem {
  id: number;
  menuName: string;
  color: string;
  price: number;
}
