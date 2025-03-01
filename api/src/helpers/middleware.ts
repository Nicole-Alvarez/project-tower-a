import { Context, Next } from "hono";
import { verify } from "hono/jwt";
import { env } from "hono/adapter";

const authMiddleware = async (c: Context, next: Next) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return c.json({ message: "Unauthorized", ok: false }, 401);
  }

  try {
    const { JWT_SECRET } = env<{ JWT_SECRET: string }>(c);
    const user = await verify(token, JWT_SECRET);
    c.set('user', user);
    
    await next();
  } catch (error) {
    return c.json({ message: "Invalid token", ok: false }, 401);
  }
};

export { authMiddleware };
