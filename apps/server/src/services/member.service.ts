import type { CreateMemberInput, UpdateMemberInput } from "../schema/member.schema";
import { db } from "../db";
import { members } from "../db/schema/gym";
import { eq, count } from "drizzle-orm";
import GymService from "./gym.service";

const paginated = async () => {
  const items = await db.select().from(members);
  const totalCount = await db.select({ count: count() }).from(members);
  
  return {
    items,
    count: totalCount[0].count,
  };
};

const paginatedByGym = async (gymId: string) => {
  const items = await db.select().from(members).where(eq(members.gymId, gymId));
  const totalCount = await db.select({ count: count() }).from(members).where(eq(members.gymId, gymId));
  
  return {
    items,
    count: totalCount[0].count,
  };
};

const exist = async (id: string) => {
  const result = await db.select().from(members).where(eq(members.id, id));
  return result[0] || null;
};

const create = async (data: CreateMemberInput & { gymId: string }) => {
  const gym = await GymService.exist(data.gymId);
  if (!gym) {
    return null;
  }

  const result = await db.insert(members).values(data).returning();
  return result[0];
};

const update = async (id: string, data: UpdateMemberInput) => {
  if (data.gymId) {
    const gym = await GymService.exist(data.gymId);
    if (!gym) {
      return null;
    }
  }

  const result = await db
    .update(members)
    .set(data)
    .where(eq(members.id, id))
    .returning();
  
  return result[0] || null;
};

const remove = async (id: string) => {
  const result = await db
    .delete(members)
    .where(eq(members.id, id))
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