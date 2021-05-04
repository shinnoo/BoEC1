export interface IFullname {
  id?: number;
  firstName?: string | null;
  lastName?: string | null;
}

export class Fullname implements IFullname {
  constructor(public id?: number, public firstName?: string | null, public lastName?: string | null) {}
}

export function getFullnameIdentifier(fullname: IFullname): number | undefined {
  return fullname.id;
}
