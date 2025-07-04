import {
  Button as NativeBaseButton,
  type IButtonProps,
  Text,
} from 'native-base';
import React from 'react';

type ButtonProps = IButtonProps & {
  title: string;
};

export const Button = ({ title, _text, h, height, ...rest }: ButtonProps) => {
  return (
    <NativeBaseButton
      justifyContent="center"
      alignItems="center"
      display="flex"
      height={h || height || 14}
      w="full"
      {...rest}
    >
      <Text fontSize="md" textTransform="uppercase" {..._text}>
        {title}
      </Text>
    </NativeBaseButton>
  );
};
