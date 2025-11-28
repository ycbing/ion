import { Router } from "express";
import { CopyController } from "../controllers/copy-controller";
import { ImageController } from "../controllers/image-controller";
import { validateRequest } from "../middleware/validate-request";
import { generateCopySchema } from "../schemas/copy-schema";
import { generateImageSchema } from "../schemas/image-schema";
import { asyncHandler } from "../utils/async-handler";

export interface ApiRouterDependencies {
  copyController: CopyController;
  imageController: ImageController;
}

export const createApiRouter = ({
  copyController,
  imageController
}: ApiRouterDependencies) => {
  const router = Router();

  router.post(
    "/copies",
    validateRequest(generateCopySchema),
    asyncHandler(async (req, res) => {
      await copyController.createCopy(req, res);
    })
  );

  router.post(
    "/images",
    validateRequest(generateImageSchema),
    asyncHandler(async (req, res) => {
      await imageController.createImage(req, res);
    })
  );

  return router;
};
