import { AxiosProgressEvent } from "axios";

export interface IUser {
  id: number;
  email: string;
  name: string; 
  userType: string;
  createdAt: Date;
  updatedAt: Date; 
}
 
