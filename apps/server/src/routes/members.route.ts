import { Hono } from "hono";
import MemberService from "../services/member.service";
import GymService from "../services/gym.service";
import { ValidationMiddleware } from "../middleware/validation.middleware";
import { CreateMemberSchema, UpdateMemberSchema } from "../schema/member.schema";

export const router = new Hono();

/**
 * Get all members for a gym
 * @api members.list
 */
router.get("/:gymId/members", async (c) => {
  const gymId = c.req.param("gymId");
  
  const gym = await GymService.exist(gymId);
  if (!gym) {
    return c.json(
      {
        success: false,
        message: "Gym not found",
      },
      404
    );
  }

  const result = await MemberService.paginatedByGym(gymId);
  return c.json({
    success: true,
    data: result.items,
    count: result.count,
  });
});

/**
 * Get a member by ID
 * @api members.get
 */
router.get("/:gymId/members/:id", async (c) => {
  const gymId = c.req.param("gymId");
  const id = c.req.param("id");
  
  const gym = await GymService.exist(gymId);
  if (!gym) {
    return c.json(
      {
        success: false,
        message: "Gym not found",
      },
      404
    );
  }
  
  const member = await MemberService.exist(id);
  
  if (!member || member.gymId !== gymId) {
    return c.json(
      {
        success: false,
        message: "Member not found",
      },
      404
    );
  }

  return c.json({
    success: true,
    data: member,
  });
});

/**
 * Create a new member
 * @api members.create
 */
router.post(
  "/:gymId/members",
  ValidationMiddleware(CreateMemberSchema),
  async (c) => {
    const gymId = c.req.param("gymId");
    const data = c.req.valid("json");
    
    const gym = await GymService.exist(gymId);
    if (!gym) {
      return c.json(
        {
          success: false,
          message: "Gym not found",
        },
        404
      );
    }

    const memberData = { ...data, gymId };
    const member = await MemberService.create(memberData);

    if (!member) {
      return c.json(
        {
          success: false,
          message: "Failed to create member",
        },
        400
      );
    }

    return c.json(
      {
        success: true,
        data: member,
        message: "Member created successfully",
      },
      201
    );
  }
);

/**
 * Update a member
 * @api members.update
 */
router.patch(
  "/:gymId/members/:id",
  ValidationMiddleware(UpdateMemberSchema),
  async (c) => {
    const gymId = c.req.param("gymId");
    const id = c.req.param("id");
    const data = c.req.valid("json");
    
    const gym = await GymService.exist(gymId);
    if (!gym) {
      return c.json(
        {
          success: false,
          message: "Gym not found",
        },
        404
      );
    }
    
    const existingMember = await MemberService.exist(id);
    if (!existingMember || existingMember.gymId !== gymId) {
      return c.json(
        {
          success: false,
          message: "Member not found",
        },
        404
      );
    }
    
    const member = await MemberService.update(id, data);

    return c.json({
      success: true,
      data: member,
      message: "Member updated successfully",
    });
  }
);

/**
 * Delete a member
 * @api members.delete
 */
router.delete("/:gymId/members/:id", async (c) => {
  const gymId = c.req.param("gymId");
  const id = c.req.param("id");
  
  const gym = await GymService.exist(gymId);
  if (!gym) {
    return c.json(
      {
        success: false,
        message: "Gym not found",
      },
      404
    );
  }
  
  const existingMember = await MemberService.exist(id);
  if (!existingMember || existingMember.gymId !== gymId) {
    return c.json(
      {
        success: false,
        message: "Member not found",
      },
      404
    );
  }
  
  const member = await MemberService.remove(id);

  return c.json({
    success: true,
    data: member,
    message: "Member deleted successfully",
  });
});

