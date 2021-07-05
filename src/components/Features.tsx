import type { IconProps, StackProps, SimpleGridProps } from "@chakra-ui/react";
import { Icon, Text, VStack, SimpleGrid } from "@chakra-ui/react";
import type { IconType } from "react-icons";
import type { VFC } from "react";

type FeaturesProps = {
  features: Array<{
    icon: IconType;
    description: string;
  }>;
  vStackProps?: StackProps;
  simpleGridProps?: SimpleGridProps;
  iconProps?: IconProps;
};

export const Features: VFC<FeaturesProps> = ({
  features,
  vStackProps,
  simpleGridProps,
  iconProps,
}) => {
  return (
    <SimpleGrid columns={features.length} {...simpleGridProps}>
      {features.map(({ icon, description }, idx) => {
        return (
          <VStack key={idx} {...vStackProps}>
            <Icon as={icon} {...iconProps} />
            <Text textAlign={"center"}>{description}</Text>
          </VStack>
        );
      })}
    </SimpleGrid>
  );
};
