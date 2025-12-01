import { CopyController } from "./controllers/copy-controller";
import { ImageController } from "./controllers/image-controller";
import { ProviderController } from "./controllers/provider-controller";
import type { AiProviderRouter } from "./providers/ai-provider-router";
import type { ProviderRegistry } from "./providers/provider-registry";
import { CopyService } from "./services/copy-service";
import { ImageService } from "./services/image-service";
import { ProviderService } from "./services/provider-service";

export interface ContainerDependencies {
  aiRouter: AiProviderRouter;
  providerRegistry: ProviderRegistry;
}

export const createContainer = ({
  aiRouter,
  providerRegistry
}: ContainerDependencies) => {
  const copyService = new CopyService(aiRouter, providerRegistry);
  const imageService = new ImageService(aiRouter, providerRegistry);
  const providerService = new ProviderService(providerRegistry);

  const copyController = new CopyController(copyService);
  const imageController = new ImageController(imageService);
  const providerController = new ProviderController(providerService);

  return {
    copyController,
    imageController,
    providerController
  };
};
