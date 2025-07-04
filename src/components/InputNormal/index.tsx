import {
  type IInputProps,
  Input as NativeBaseInput,
  Text,
  View,
} from 'native-base';
import React from 'react';

type InputProps = IInputProps & {
  label: string;
  error?: string;
};

export function InputNormal({
  label,
  error,
  color,
  mb,
  textTransform = 'uppercase',
  ...rest
}: InputProps) {
  return (
    <View mb={mb || 8}>
      <Text
        mb={-2}
        textTransform={textTransform}
        color={color || 'primary.700'}
      >
        {label}
      </Text>

      <NativeBaseInput
        w="full"
        variant="underlined"
        height={14}
        size="md"
        fontSize="md"
        pb={0}
        placeholderTextColor="gray.700"
        {...rest}
      />

      {error && (
        <Text color="secondary.700" mb={2}>
          {error}
        </Text>
      )}
    </View>
  );
}
