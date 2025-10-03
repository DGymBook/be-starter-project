import type { CreatePlanInput, UpdatePlanInput } from "../schema/plan.schema";
import { db } from "../db";
import { plans } from "../db/schema/gym";
import { eq, count } from "drizzle-orm";
import GymService from "./gym.service";

const paginated = async () => {
  const items = await db.select().from(plans);
  const totalCount = await db.select({ count: count() }).from(plans);
  
  return {
    items,
    count: totalCount[0].count,
  };
};

const paginatedByGym = async (gymId: string) => {
  const items = await db.select().from(plans).where(eq(plans.gymId, gymId));
  const totalCount = await db.select({ count: count() }).from(plans).where(eq(plans.gymId, gymId));
  
  return {
    items,
    count: totalCount[0].count,
  };
};

const exist = async (id: string) => {
  const result = await db.select().from(plans).where(eq(plans.id, id));
  return result[0] || null;
};

const create = async (data: CreatePlanInput & { gymId: string }) => {
  const gym = await GymService.exist(data.gymId);
  if (!gym) {
    return null;
  }

  const planData = {
    ...data,
    price: data.price.toString(),
  };

  const result = await db.insert(plans).values(planData).returning();
  return result[0];
};

const update = async (id: string, data: UpdatePlanInput) => {
  if (data.gymId) {
    const gym = await GymService.exist(data.gymId);
    if (!gym) {
      return null;
    }
  }

  const { price, ...otherData } = data;
  const updateData = {
    ...otherData,
    ...(price !== undefined && { price: price.toString() }),
  };

  const result = await db
    .update(plans)
    .set(updateData)
    .where(eq(plans.id, id))
    .returning();
  
  return result[0] || null;
};

const remove = async (id: string) => {
  const result = await db
    .delete(plans)
    .where(eq(plans.id, id))
    .returning();
  
  return result[0] || null;
};

export default {
  paginated,
  paginatedByGym,
  exist,
  create,
  update,
  remove,
};