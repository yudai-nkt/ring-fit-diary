import {
  Icon,
  IconProps,
  Text,
  VStack,
  StackProps,
  SimpleGrid,
  SimpleGridProps,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { VFC } from "react";

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
