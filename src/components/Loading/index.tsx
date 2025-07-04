import { Center, type ICenterProps, Spinner } from 'native-base';
import React from 'react';

type LoadingProps = ICenterProps;

export const Loading = ({ ...rest }: LoadingProps) => {
  return (
    <Center flex={1} bg="white" zIndex={999} {...rest}>
      <Spinner color="primary.700" size="lg" />
    </Center>
  );
};
