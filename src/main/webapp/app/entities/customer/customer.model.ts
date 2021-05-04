import { IFullname } from 'app/entities/fullname/fullname.model';
import { IOrders } from 'app/entities/orders/orders.model';
import { IAddress } from 'app/entities/address/address.model';
import { IPayment } from 'app/entities/payment/payment.model';

export interface ICustomer {
  id?: number;
  age?: number | null;
  fullname?: IFullname | null;
  orders?: IOrders | null;
  address?: IAddress | null;
  payment?: IPayment | null;
}

export class Customer implements ICustomer {
  constructor(
    public id?: number,
    public age?: number | null,
    public fullname?: IFullname | null,
    public orders?: IOrders | null,
    public address?: IAddress | null,
    public payment?: IPayment | null
  ) {}
}

export function getCustomerIdentifier(customer: ICustomer): number | undefined {
  return customer.id;
}
