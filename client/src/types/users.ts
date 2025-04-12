import { Event } from "./events";

export enum UserRole {
   USER = 'user',
   ADMIN = 'admin',
   MEMBER = 'member',
}

export type User = {
   id: string;
   email: string;
   name?: string;
   dateOfBirth?: Date;
   role: UserRole;
   instagram?: string;
   telegram?: string;
   cart: Event[];
}