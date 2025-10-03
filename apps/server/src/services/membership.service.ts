import type { CreateMembershipInput, UpdateMembershipInput } from "../schema/membership.schema";
import MemberService from "./member.service";
import PlanService from "./plan.service";
import { db } from "../db";
import { memberships, members } from "../db/schema/gym";
import { eq, count } from "drizzle-orm";

const paginated = async () => {
  const items = await db.select().from(memberships);
  const totalCount = await db.select({ count: count() }).from(memberships);
  
  return {
    items,
    count: totalCount[0].count,
  };
};

const paginatedByGym = async (gymId: string) => {
  const items = await db
    .select()
    .from(memberships)
    .innerJoin(members, eq(memberships.memberId, members.id))
    .where(eq(members.gymId, gymId));
    
  const totalCount = await db
    .select({ count: count() })
    .from(memberships)
    .innerJoin(members, eq(memberships.memberId, members.id))
    .where(eq(members.gymId, gymId));
  
  return {
    items: items.map(item => item.memberships),
    count: totalCount[0].count,
  };
};

const exist = async (id: string) => {
  const result = await db.select().from(memberships).where(eq(memberships.id, id));
  return result[0] || null;
};

const create = async (data: CreateMembershipInput) => {
  const member = await MemberService.exist(data.memberId);
  const plan = await PlanService.exist(data.planId);

  if (!member || !plan) {
    return null;
  }

  const startDate = data.startDate ? new Date(data.startDate) : new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + plan.duration);

  const membershipData = {
    memberId: data.memberId,
    planId: data.planId,
    startDate,
    endDate,
    amount: plan.price,
    status: "active" as const,
  };

  const result = await db.insert(memberships).values(membershipData).returning();
  return result[0];
};

const update = async (id: string, data: UpdateMembershipInput) => {
  const result = await db
    .update(memberships)
    .set(data)
    .where(eq(memberships.id, id))
    .returning();
  
  return result[0] || null;
};

const remove = async (id: string) => {
  const result = await db
    .delete(memberships)
    .where(eq(memberships.id, id))
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