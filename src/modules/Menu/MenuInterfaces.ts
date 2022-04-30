export interface IMenuItem {
  id?: string;
  menuName: string;
  color: string;
  price: string;
}

export interface IMenuListItem extends IMenuItem {
  amount: number;
}
