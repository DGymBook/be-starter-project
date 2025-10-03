import { Hono } from "hono";
import GymService from "../services/gym.service";
import { ValidationMiddleware } from "../middleware/validation.middleware";
import { CreateGymSchema, UpdateGymSchema } from "../schema/gym.schema";

const name = "gyms";
export const router = new Hono().basePath(name);

/**
 * Get all gyms
 * @api gyms.list
 */
router.get("/", async (c) => {
  const result = await GymService.paginated();
  return c.json({
    success: true,
    data: result.items,
    count: result.count,
  });
});

/**
 * Get a gym by ID
 * @api gyms.get
 */
router.get("/:id", async (c) => {
  const id = c.req.param("id");
  const gym = await GymService.exist(id);
  
  if (!gym) {
    return c.json(
      {
        success: false,
        message: "Gym not found",
      },
      404
    );
  }

  return c.json({
    success: true,
    data: gym,
  });
});

/**
 * Create a new gym
 * @api gyms.create
 */
router.post(
  "/",
  ValidationMiddleware(CreateGymSchema),
  async (c) => {
    const data = c.req.valid("json");
    const gym = await GymService.create(data);

    return c.json(
      {
        success: true,
        data: gym,
        message: "Gym created successfully",
      },
      201
    );
  }
);

/**
 * Update a gym
 * @api gyms.update
 */
router.patch(
  "/:id",
  ValidationMiddleware(UpdateGymSchema),
  async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");
    
    const gym = await GymService.update(id, data);
    
    if (!gym) {
      return c.json(
        {
          success: false,
          message: "Gym not found",
        },
        404
      );
    }

    return c.json({
      success: true,
      data: gym,
      message: "Gym updated successfully",
    });
  }
);

/**
 * Delete a gym
 * @api gyms.delete
 */
router.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const gym = await GymService.remove(id);
  
  if (!gym) {
    return c.json(
      {
        success: false,
        message: "Gym not found",
      },
      404
    );
  }

  return c.json({
    success: true,
    data: gym,
    message: "Gym deleted successfully",
  });
});