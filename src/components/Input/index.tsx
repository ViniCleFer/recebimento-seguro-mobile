import {
  type IInputProps,
  Input as NativeBaseInput,
  Text,
  View,
} from 'native-base';
import React from 'react';
import { type Control, Controller, type FieldError } from 'react-hook-form';

type InputProps = IInputProps & {
  control: Control<any>;
  name: string;
  label: string;
  error?: FieldError;
  isWhite?: boolean;
};

export function Input({
  name,
  label,
  control,
  error,
  isWhite = false,
  color,
  mb,
  ...rest
}: InputProps) {
  return (
    <View mb={mb || 8}>
      <Text mb={-2} textTransform="uppercase" color={color || 'primary.700'}>
        {label}
      </Text>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field: { onChange, value, onBlur, ref } }) => (
          <>
            <NativeBaseInput
              w="full"
              variant="underlined"
              height={14}
              size="md"
              fontSize="md"
              pb={0}
              placeholderTextColor="gray.700"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              ref={ref}
              _focus={{ borderColor: 'gray.500' }}
              {...rest}
            />

            {error && (
              <Text color="secondary.700" mb={2}>
                {error?.message}
              </Text>
            )}
          </>
        )}
      />
    </View>
  );
}
