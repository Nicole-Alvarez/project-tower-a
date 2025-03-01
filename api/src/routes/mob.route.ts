import { Context, Hono } from "hono"; 
import { findMobs } from "../services/mobs";

const mobRoutes = new Hono(); 

mobRoutes.get('/all', async (c: Context) => {
  try { 
    const mobs =  await findMobs();  
    if(!mobs) {
      throw new Error('Failed to get mobs');
    }
    return c.json({mobs: mobs}, 200);
  } catch(error) {
    return c.json({ message: "Internal server error" }, 500);
  }
}); 

export default mobRoutes;

