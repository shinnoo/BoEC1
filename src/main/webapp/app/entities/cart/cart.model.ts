import { IPayment } from 'app/entities/payment/payment.model';

export interface ICart {
  id?: number;
  quantity?: number | null;
  payment?: IPayment | null;
}

export class Cart implements ICart {
  constructor(public id?: number, public quantity?: number | null, public payment?: IPayment | null) {}
}

export function getCartIdentifier(cart: ICart): number | undefined {
  return cart.id;
}
