import { CopyController } from "./controllers/copy-controller";
import { ImageController } from "./controllers/image-controller";
import type { AiProviderRouter } from "./providers/ai-provider-router";
import { CopyService } from "./services/copy-service";
import { ImageService } from "./services/image-service";
import { ProviderSelector } from "./services/provider-selector";
import { settings } from "./config";

export interface ContainerDependencies {
  aiRouter: AiProviderRouter;
}

export const createContainer = ({ aiRouter }: ContainerDependencies) => {
  const providerSelector = new ProviderSelector(settings.providers);

  const copyService = new CopyService(aiRouter, providerSelector);
  const imageService = new ImageService(aiRouter, providerSelector);

  const copyController = new CopyController(copyService);
  const imageController = new ImageController(imageService);

  return {
    copyController,
    imageController
  };
};
