import { prisma } from "../helpers/db" 
 
export const getTestService = async() => { 
  const users = await prisma.user.findMany(); 

  return users
}
  