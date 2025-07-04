import React from 'react';
import { Text, Box, useTheme, Input, IInputProps } from 'native-base';
import { Control, Controller } from 'react-hook-form';

import type { ColorType } from 'native-base/lib/typescript/components/types';

type InputProps = IInputProps & {
  label: string;
  labelColor?: ColorType;
  control: Control<any>;
  index: number;
  name: string;
  maxLength?: number;
};

export function InputWithLabelControlled({
  label,
  labelColor = 'gray.750',
  control,
  index,
  name,
  maxLength = 100,
  ...rest
}: InputProps) {
  const { colors } = useTheme();

  return (
    <Controller
      control={control}
      name={`respostas.${index}.${name}`}
      render={({ field }) => (
        <Box>
          <Text mb={-2} color={labelColor}>
            {label}
          </Text>
          <Input
            value={field?.value}
            onChangeText={field.onChange}
            w="full"
            variant="underlined"
            minHeight={14}
            size="md"
            fontSize="md"
            pb={0}
            placeholderTextColor="gray.700"
            maxLength={maxLength}
            _focus={{ borderColor: 'primary.700' }}
            autoComplete="off"
            {...rest}
          />
        </Box>
      )}
    />
  );
}
