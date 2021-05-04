export interface IAddress {
  id?: number;
  location?: string | null;
  street?: string | null;
  city?: string | null;
}

export class Address implements IAddress {
  constructor(public id?: number, public location?: string | null, public street?: string | null, public city?: string | null) {}
}

export function getAddressIdentifier(address: IAddress): number | undefined {
  return address.id;
}
