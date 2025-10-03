import { Hono } from "hono";
import PlanService from "../services/plan.service";
import GymService from "../services/gym.service";
import { ValidationMiddleware } from "../middleware/validation.middleware";
import { CreatePlanSchema, UpdatePlanSchema } from "../schema/plan.schema";

export const router = new Hono();

/**
 * Get all plans for a gym
 * @api plans.list
 */
router.get("/:gymId/plans", async (c) => {
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

  const result = await PlanService.paginatedByGym(gymId);
  return c.json({
    success: true,
    data: result.items,
    count: result.count,
  });
});

/**
 * Get a plan by ID
 * @api plans.get
 */
router.get("/:gymId/plans/:id", async (c) => {
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
  
  const plan = await PlanService.exist(id);
  
  if (!plan || plan.gymId !== gymId) {
    return c.json(
      {
        success: false,
        message: "Plan not found",
      },
      404
    );
  }

  return c.json({
    success: true,
    data: plan,
  });
});

/**
 * Create a new plan
 * @api plans.create
 */
router.post(
  "/:gymId/plans",
  ValidationMiddleware(CreatePlanSchema),
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

    const planData = { ...data, gymId };
    const plan = await PlanService.create(planData);

    if (!plan) {
      return c.json(
        {
          success: false,
          message: "Failed to create plan",
        },
        400
      );
    }

    return c.json(
      {
        success: true,
        data: plan,
        message: "Plan created successfully",
      },
      201
    );
  }
);

/**
 * Update a plan
 * @api plans.update
 */
router.patch(
  "/:gymId/plans/:id",
  ValidationMiddleware(UpdatePlanSchema),
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
    
    const existingPlan = await PlanService.exist(id);
    if (!existingPlan || existingPlan.gymId !== gymId) {
      return c.json(
        {
          success: false,
          message: "Plan not found",
        },
        404
      );
    }
    
    const plan = await PlanService.update(id, data);

    return c.json({
      success: true,
      data: plan,
      message: "Plan updated successfully",
    });
  }
);

/**
 * Delete a plan
 * @api plans.delete
 */
router.delete("/:gymId/plans/:id", async (c) => {
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
  
  const existingPlan = await PlanService.exist(id);
  if (!existingPlan || existingPlan.gymId !== gymId) {
    return c.json(
      {
        success: false,
        message: "Plan not found",
      },
      404
    );
  }
  
  const plan = await PlanService.remove(id);

  return c.json({
    success: true,
    data: plan,
    message: "Plan deleted successfully",
  });
});

