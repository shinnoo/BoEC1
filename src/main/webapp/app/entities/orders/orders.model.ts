import { IItem } from 'app/entities/item/item.model';

export interface IOrders {
  id?: number;
  totalPrice?: number | null;
  cartId?: number | null;
  item?: IItem | null;
}

export class Orders implements IOrders {
  constructor(public id?: number, public totalPrice?: number | null, public cartId?: number | null, public item?: IItem | null) {}
}

export function getOrdersIdentifier(orders: IOrders): number | undefined {
  return orders.id;
}
