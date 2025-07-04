import React from 'react';
import { Text, ITextProps } from 'native-base';

interface TitleProps extends ITextProps {}

export default function Title({ children, ...rest }: TitleProps) {
  return (
    <Text color="primary.700" fontSize="2xl" fontWeight="bold" {...rest}>
      {children}
    </Text>
  );
}
