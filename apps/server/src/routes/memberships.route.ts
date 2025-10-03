import { Hono } from "hono";
import MembershipService from "../services/membership.service";
import GymService from "../services/gym.service";
import MemberService from "../services/member.service";
import { ValidationMiddleware } from "../middleware/validation.middleware";
import { 
  CreateMembershipSchema, 
  UpdateMembershipSchema,
} from "../schema/membership.schema";

export const router = new Hono();

/**
 * Get all memberships for a gym
 * @api memberships.list
 */
router.get("/:gymId/memberships", async (c) => {
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

  const result = await MembershipService.paginatedByGym(gymId);
  return c.json({
    success: true,
    data: result.items,
    count: result.count,
  });
});

/**
 * Get a membership by ID
 * @api memberships.get
 */
router.get("/:gymId/memberships/:id", async (c) => {
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
  
  const membership = await MembershipService.exist(id);
  
  if (!membership) {
    return c.json(
      {
        success: false,
        message: "Membership not found",
      },
      404
    );
  }

  // Verify the membership belongs to the gym via the member
  const member = await MemberService.exist(membership.memberId);
  if (!member || member.gymId !== gymId) {
    return c.json(
      {
        success: false,
        message: "Membership not found",
      },
      404
    );
  }

  return c.json({
    success: true,
    data: membership,
  });
});

/**
 * Create a new membership
 * @api memberships.create
 */
router.post(
  "/:gymId/memberships",
  ValidationMiddleware(CreateMembershipSchema),
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

    // Verify member and plan belong to this gym
    const member = await MemberService.exist(data.memberId);
    if (!member || member.gymId !== gymId) {
      return c.json(
        {
          success: false,
          message: "Member not found in this gym",
        },
        400
      );
    }

    const membership = await MembershipService.create(data);

    if (!membership) {
      return c.json(
        {
          success: false,
          message: "Failed to create membership. Member or plan not found.",
        },
        400
      );
    }

    return c.json(
      {
        success: true,
        data: membership,
        message: "Membership created successfully",
      },
      201
    );
  }
);

/**
 * Update a membership
 * @api memberships.update
 */
router.patch(
  "/:gymId/memberships/:id",
  ValidationMiddleware(UpdateMembershipSchema),
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
    
    const existingMembership = await MembershipService.exist(id);
    if (!existingMembership) {
      return c.json(
        {
          success: false,
          message: "Membership not found",
        },
        404
      );
    }

    // Verify the membership belongs to the gym via the member
    const member = await MemberService.exist(existingMembership.memberId);
    if (!member || member.gymId !== gymId) {
      return c.json(
        {
          success: false,
          message: "Membership not found",
        },
        404
      );
    }
    
    const membership = await MembershipService.update(id, data);

    return c.json({
      success: true,
      data: membership,
      message: "Membership updated successfully",
    });
  }
);

/**
 * Delete a membership
 * @api memberships.delete
 */
router.delete("/:gymId/memberships/:id", async (c) => {
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
  
  const existingMembership = await MembershipService.exist(id);
  if (!existingMembership) {
    return c.json(
      {
        success: false,
        message: "Membership not found",
      },
      404
    );
  }

  // Verify the membership belongs to the gym via the member
  const member = await MemberService.exist(existingMembership.memberId);
  if (!member || member.gymId !== gymId) {
    return c.json(
      {
        success: false,
        message: "Membership not found",
      },
      404
    );
  }
  
  const membership = await MembershipService.remove(id);

  return c.json({
    success: true,
    data: membership,
    message: "Membership deleted successfully",
  });
});