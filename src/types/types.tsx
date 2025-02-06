export interface Message {
  type: string;
  text?: string;
  message?: string;
}

export interface User {
  id: number;
  name: string;
}

export interface RoomDetails {
  roomId: string;
  name: string;
  adminId: number;
  users: User[];
}

