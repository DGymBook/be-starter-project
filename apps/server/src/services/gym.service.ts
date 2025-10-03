import type { CreateGymInput, UpdateGymInput } from "../schema/gym.schema";
import { db } from "../db";
import { gyms } from "../db/schema/gym";
import { eq, count } from "drizzle-orm";

const paginated = async () => {
  const items = await db.select().from(gyms);
  const totalCount = await db.select({ count: count() }).from(gyms);
  
  return {
    items,
    count: totalCount[0].count,
  };
};

const exist = async (id: string) => {
  const result = await db.select().from(gyms).where(eq(gyms.id, id));
  return result[0] || null;
};

const create = async (data: CreateGymInput) => {
  const result = await db.insert(gyms).values(data).returning();
  return result[0];
};

const update = async (id: string, data: UpdateGymInput) => {
  const result = await db
    .update(gyms)
    .set(data)
    .where(eq(gyms.id, id))
    .returning();
  
  return result[0] || null;
};

const remove = async (id: string) => {
  const result = await db
    .delete(gyms)
    .where(eq(gyms.id, id))
    .returning();
  
  return result[0] || null;
};

export default {
  paginated,
  exist,
  create,
  update,
  remove,
};