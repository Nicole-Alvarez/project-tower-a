import dayjs from "dayjs";
import { prisma } from "../helpers/db";
import { User } from "@prisma/client";
import { ISearchUsers, } from "../interfaces/user.interface";

 
export const findUserById = async (id: number) => {
  const user = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  return user;
};

 
export const findMobs = async () => {
  const mobs = await prisma.mob.findMany(); 
  return mobs;
};


 