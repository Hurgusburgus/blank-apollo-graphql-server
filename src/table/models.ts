

export interface Table {
  id: string;
  gameInfoId: string;
  access: TableAccess;
  createdBy: string;
  createdOn: string;
  maxPlayers: number;
  invitees: string[];
  participants: string[];
}

export enum TableAccess {
  PUBLIC = 'public',
  FRIENDS = 'friends',
  INVITE = 'invite'
}
