import * as dayjs from 'dayjs';

export interface IPayment {
  id?: number;
  createAt?: dayjs.Dayjs | null;
  code?: string | null;
}

export class Payment implements IPayment {
  constructor(public id?: number, public createAt?: dayjs.Dayjs | null, public code?: string | null) {}
}

export function getPaymentIdentifier(payment: IPayment): number | undefined {
  return payment.id;
}
