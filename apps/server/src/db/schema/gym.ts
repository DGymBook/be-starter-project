import { pgTable, text, timestamp, integer, decimal, pgEnum, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const memberStatusEnum = pgEnum("member_status", ["active", "inactive"]);
export const planStatusEnum = pgEnum("plan_status", ["active", "inactive"]);
export const membershipStatusEnum = pgEnum("membership_status", ["active", "expired", "paused", "cancelled"]);
export const gymStatusEnum = pgEnum("gym_status", ["active", "inactive"]);

export const gyms = pgTable("gyms", {
	id: uuid("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	address: text("address"),
	phone: text("phone"),
	email: text("email"),
	status: gymStatusEnum("status").notNull().default("active"),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().$onUpdate(() => new Date()),
});

export const members = pgTable("members", {
	id: uuid("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	email: text("email"),
	phone: text("phone").notNull(),
	dateOfBirth: text("date_of_birth"),
	address: text("address"),
	gymId: uuid("gym_id").notNull().references(() => gyms.id, { onDelete: "cascade" }),
	status: memberStatusEnum("status").notNull().default("active"),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().$onUpdate(() => new Date()),
});

export const plans = pgTable("plans", {
	id: uuid("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	description: text("description"),
	price: decimal("price", { precision: 10, scale: 2 }).notNull(),
	duration: integer("duration").notNull(),
	gymId: uuid("gym_id").notNull().references(() => gyms.id, { onDelete: "cascade" }),
	status: planStatusEnum("status").notNull().default("active"),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().$onUpdate(() => new Date()),
});

export const memberships = pgTable("memberships", {
	id: uuid("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	memberId: uuid("member_id").notNull().references(() => members.id, { onDelete: "cascade" }),
	planId: uuid("plan_id").notNull().references(() => plans.id, { onDelete: "restrict" }),
	status: membershipStatusEnum("status").notNull().default("active"),
	startDate: timestamp("start_date", { withTimezone: true }).notNull(),
	endDate: timestamp("end_date", { withTimezone: true }).notNull(),
	amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().$onUpdate(() => new Date()),
});

// Relations for better type inference and queries
export const gymsRelations = relations(gyms, ({ many }) => ({
	members: many(members),
	plans: many(plans),
}));

export const membersRelations = relations(members, ({ one, many }) => ({
	gym: one(gyms, {
		fields: [members.gymId],
		references: [gyms.id],
	}),
	memberships: many(memberships),
}));

export const plansRelations = relations(plans, ({ one, many }) => ({
	gym: one(gyms, {
		fields: [plans.gymId],
		references: [gyms.id],
	}),
	memberships: many(memberships),
}));

export const membershipsRelations = relations(memberships, ({ one }) => ({
	member: one(members, {
		fields: [memberships.memberId],
		references: [members.id],
	}),
	plan: one(plans, {
		fields: [memberships.planId],
		references: [plans.id],
	}),
}));