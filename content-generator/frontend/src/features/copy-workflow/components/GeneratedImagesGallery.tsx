import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  Image,
  SimpleGrid,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";

import { AppIcon } from "@/components/icons";
import type { WorkflowImageRecord } from "../types";

interface GeneratedImagesGalleryProps {
  images: WorkflowImageRecord[];
}

const formatTimestamp = (value: string): string => {
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch (error) {
    console.warn("[GeneratedImagesGallery] Failed to format timestamp", error);
    return value;
  }
};

export const GeneratedImagesGallery = ({ images }: GeneratedImagesGalleryProps) => {
  const toast = useToast();

  const handleShare = async (url: string) => {
    const nav = navigator as Navigator & {
      share?: (data: ShareData) => Promise<void>;
    };

    try {
      if (typeof nav.share === "function") {
        await nav.share({ url });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        throw new Error("No share handler available");
      }

      toast({
        title: "Link copied",
        description: "Share the generated image with collaborators.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.warn("[GeneratedImagesGallery] Share failed", error);
      toast({
        title: "Share failed",
        description: "We couldn't copy the image link. Try manually copying it.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  if (!images.length) {
    return (
      <Box
        borderRadius="xl"
        border="1px dashed"
        borderColor="ink.100"
        p={6}
        textAlign="center"
        color="subtle"
      >
        <Text>Generated images will land in this gallery once you confirm a copy direction.</Text>
      </Box>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
      {images.map((item) => (
        <Stack
          key={`${item.provider}-${item.generatedAt}`}
          borderRadius="xl"
          border="1px solid"
          borderColor="ink.100"
          overflow="hidden"
          bg="surface"
          spacing={0}
        >
          <Image src={item.image.url} alt={item.image.altText} objectFit="cover" height="240px" />
          <Stack spacing={3} p={4}>
            <Stack spacing={1}>
              <HStack justify="space-between" align="center">
                <Text fontWeight="semibold">{item.provider}</Text>
                <Text fontSize="sm" color="subtle">
                  {formatTimestamp(item.generatedAt)}
                </Text>
              </HStack>
              <Text fontSize="sm" color="subtle" noOfLines={2}>
                {item.copyText}
              </Text>
            </Stack>
            <ButtonGroup size="sm" spacing={2}>
              <Button
                as="a"
                href={item.image.url}
                download
                leftIcon={<AppIcon name="download" boxSize={4} />}
                variant="soft"
              >
                Download
              </Button>
              <Button
                leftIcon={<AppIcon name="share" boxSize={4} />}
                variant="outline"
                onClick={() => handleShare(item.image.url)}
              >
                Share
              </Button>
            </ButtonGroup>
          </Stack>
        </Stack>
      ))}
    </SimpleGrid>
  );
};
