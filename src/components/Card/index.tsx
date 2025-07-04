import { type IContainerProps, VStack } from 'native-base';

type ContainerProps = IContainerProps;

export const Card = ({ children, ...rest }: ContainerProps) => {
  return (
    <VStack p={5} borderRadius={8} shadow="8" bg="white" {...rest}>
      {children}
    </VStack>
  );
};
