import { Hono, type Context } from "hono";
import { findAdmin, createUser, verifyUserAccount, findStudent, findTeacher, findUserById, findSystemUser, findRegularUser } from "../services/auth";
import { sign, verify } from "hono/jwt";
import argon2 from "argon2";
import { env } from "hono/adapter";
import { zValidator } from "@hono/zod-validator";
import { adminLogInSchema, resendVerificationLinkSchema, studentLogInSchema, teacherLogInSchema, userLogInSchema, userSignUpSchema, verifyAccountSchema } from "../schemas/auth.schema";
 
const authRoutes = new Hono();

authRoutes.post(
	'/admin-login',
	zValidator('json', adminLogInSchema.json),
	async (c: Context) => {
		try {
			const body = await c.req.json();

			const user = await findAdmin({ email: body.email });
	
			if (!user) {
				return c.json({message: "Account doesn't exist"}, 401);
			}

			const passwordVerified = await argon2.verify(user.password, body.password);
			if(!passwordVerified) {
				return c.json({message: "Incorrect password"}, 401);
			}

			const { password, ...userWithoutPassword } = user;			
			// password match
			const payload = {
				...userWithoutPassword,
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

 
authRoutes.post(
	'/login',
	zValidator('json', userLogInSchema.json),
	async (c: Context) => {
		try {
			const body = await c.req.json();
			let user;

			const regularUser = await findRegularUser({ email: body.email, userType: body.userType });

			if(regularUser.length > 1){
				return c.json({status: "conflict"}, 200);
			}

			if(regularUser.length === 1){
				user = regularUser[0];
			}

			if (!user) {
				const systemUser = await findSystemUser({ email: body.email });
				if (!systemUser) {
					return c.json({ message: "Account doesn't exist" }, 401);
				}
				user = systemUser;
			}

			const passwordVerified = await argon2.verify(user.password, body.password);
			if(!passwordVerified) {
				return c.json({message: "Incorrect password"}, 401);
			}

			if (user.userType !== "ADMIN" && !user.isVerified) {
				return c.json({ message: "Account not yet verified" }, 401);
			}

			const { password, ...userWithoutPassword } = user;			
			// password match
			const payload = {
				...userWithoutPassword,
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