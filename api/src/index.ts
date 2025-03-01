import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import type { JwtVariables } from "hono/jwt"; 
import authRoutes from "./routes/auth.routes";
import { authMiddleware } from "./helpers/middleware"; 
import userRoutes from "./routes/user.route"; 
import publicTestRoutes from "./routes/public-test.routes";

type Variables = JwtVariables;

const app = new Hono();

// middlewares
app.use("/*", cors());
app.use(logger());
app.use(prettyJSON());
app.notFound((c) => c.json({ message: "Not Found", ok: false }, 404));

// Public routes
app.route('/test', publicTestRoutes);
app.route('/auth', authRoutes); 

// /api/v1 instance
const apiv1 = new Hono<{ Variables: Variables }>();

apiv1.get("/", (c) => {
  return c.text("api v1");
});

apiv1.route('/users', userRoutes); 

app.use("/api/v1/*", authMiddleware);

// api/v1 route
app.route("/api/v1/", apiv1);

const port = 3001;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
