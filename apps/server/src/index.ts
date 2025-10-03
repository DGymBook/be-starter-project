import "dotenv/config";
// import { auth } from "./lib/auth";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { router as membersRouter } from "./routes/members.route";
import { router as plansRouter } from "./routes/plans.route";
import { router as membershipsRouter } from "./routes/memberships.route";
import { router as gymsRouter } from "./routes/gyms.route";

const app = new Hono();

app.use(logger());
app.use(
	"/*",
	cors({
		origin: process.env.CORS_ORIGIN || "*",
		allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

// Auth routes (commented out for now)
// app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.get("/", (c) => {
	return c.json({
		success: true,
		message: "Open DGymBook API - Simple Gym Management System",
		version: "1.0.0",
		endpoints: {
			gyms: "/api/gyms",
			members: "/api/:gymId/members",
			plans: "/api/:gymId/plans",
			memberships: "/api/:gymId/memberships",
		}
	});
});

app.route("/api", gymsRouter);
app.route("/api", membersRouter);
app.route("/api", plansRouter);
app.route("/api", membershipsRouter);

app.get("/api/health", (c) => {
	return c.json({
		success: true,
		status: "healthy",
		timestamp: new Date().toISOString(),
	});
});

export default app;
