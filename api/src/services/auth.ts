 import { prisma } from "../helpers/db";

interface UserAuth {
  email: string; 
}

interface User {
  name: string;
  email: string;
  password: string; 
}
 
 
export const findUser = async ({ email }: UserAuth) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  return user;
};

export const findUserById = async (id: number) => {
  const user = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  return user;
};
   
export const createUser = async (userData: User) => {
  const user = await prisma.user.create({
    data: {
      ...userData
    }
  });

  return user;
};
 
 