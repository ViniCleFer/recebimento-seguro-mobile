import {
  type ISelectProps,
  Select as NativeBaseSelect,
  Text,
  View,
} from 'native-base';
import React from 'react';
import {
  type Control,
  Controller,
  type FieldError,
  type RegisterOptions,
} from 'react-hook-form';

type SelectProps = ISelectProps & {
  control: Control<any>;
  register: (rules?: RegisterOptions) => (ref: any) => void;
  name: string;
  label: string;
  error?: FieldError;
  isWhite?: boolean;
};

export function Select({
  name,
  label,
  control,
  error,
  isWhite = false,
  register,
  ...rest
}: SelectProps) {
  return (
    <View mb={8}>
      <Text mb={-2} textTransform="uppercase" color="primary.700">
        {label}
      </Text>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={() => (
          <>
            <NativeBaseSelect
              w="full"
              variant="underlined"
              height={14}
              size="md"
              fontSize="md"
              pb={0}
              placeholderTextColor="gray.700"
              {...register}
              {...rest}
            />

            {error && (
              <Text color="secondary.700" mb={2}>
                {error.message}
              </Text>
            )}
          </>
        )}
      />
    </View>
  );
}
