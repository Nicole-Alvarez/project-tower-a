import { Hono, type Context } from "hono";
import { findUser} from "../services/auth";
import { sign, verify } from "hono/jwt";
import argon2 from "argon2";
import { env } from "hono/adapter";
import { zValidator } from "@hono/zod-validator";
import { userLogInSchema,  } from "../schemas/auth.schema";
 
const authRoutes = new Hono(); 
 
authRoutes.post(
	'/login',
	zValidator('json', userLogInSchema.json),
	async (c: Context) => {
		try {
			const body = await c.req.json(); 
 
			console.log("body: ", body)

			const user = await findUser({ email: body.email });
			console.log("user: ", user)

			if(!user){
				return c.json({status: "not_found"}, 200);
			} 
			
			const payload = {
				...user,
				exp: Math.floor(Date.now() / 1000) + 60 * 60,
			};

			// jwt sign
			const { JWT_SECRET } = env<{ JWT_SECRET: string }>(c);
			const token = await sign(payload, JWT_SECRET);

			return c.json({ token, user: payload }, 200);
			
		} catch (error) {
			return c.json({ message: 'Internal server error'}, 500);
		}
	}
)

export default authRoutes;