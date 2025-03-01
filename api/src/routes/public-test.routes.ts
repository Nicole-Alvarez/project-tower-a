import { Context, Hono } from "hono"; 
import { getTestService } from "../services/test.service";

const publicTestRoutes = new Hono();
 
publicTestRoutes.get('/testRoute', async (c: Context) => {
  try {
    const res =  await getTestService() 
    return c.json(res, 200);
  } catch (error) {
    return c.json({ message: 'Internal server error', error }, 500);
  }
}) 

export default publicTestRoutes;
