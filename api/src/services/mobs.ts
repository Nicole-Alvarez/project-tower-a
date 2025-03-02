import { prisma } from "../helpers/db"; 
 
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


 