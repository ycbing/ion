import { Router } from "express";
import { CopyController } from "../controllers/copy-controller";
import { ImageController } from "../controllers/image-controller";
import { ProviderController } from "../controllers/provider-controller";
import { validateRequest } from "../middleware/validate-request";
import { generateCopySchema } from "../schemas/copy-schema";
import { generateImageSchema } from "../schemas/image-schema";
import { updateActiveProvidersSchema } from "../schemas/provider-schema";
import { asyncHandler } from "../utils/async-handler";

export interface ApiRouterDependencies {
  copyController: CopyController;
  imageController: ImageController;
  providerController: ProviderController;
}

export const createApiRouter = ({
  copyController,
  imageController,
  providerController
}: ApiRouterDependencies) => {
  const router = Router();

  router.get(
    "/providers",
    asyncHandler(async (req, res) => {
      providerController.listProviders(req, res);
    })
  );

  router.patch(
    "/providers/active",
    validateRequest(updateActiveProvidersSchema),
    asyncHandler(async (req, res) => {
      await providerController.updateActiveProviders(req, res);
    })
  );

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
