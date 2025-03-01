import { IUser } from "./user.interface";

export interface ISessionData {
  token: string | null;
  user: IUser | null;
  status?: string;
}

export interface ICredentials {
  email: string; 
}

export interface IStudentSignUp {
  name: string;
  email: string;
  password: string;
}

export interface ITeacherSignUp {
  name: string;
  email: string;
  password: string;
}

export interface IVerifyAccount {
  token: string;
  id: number;
}