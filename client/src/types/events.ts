import { User, UserRole } from "./users";

export type Event = {
   id: string;
   name: string;
   description?: string;
   date: string;
   price: number;
   address?: string;
   target?: UserRole;
   capacity: number;
   imageUrl?: string;
   enrolledUsers: User[];
}