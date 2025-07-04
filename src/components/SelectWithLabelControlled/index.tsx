import {
  type ISelectProps,
  Select as NativeBaseSelect,
  Text,
  View,
  useTheme,
} from 'native-base';
import React from 'react';
import { Control, Controller } from 'react-hook-form';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ColorType } from 'native-base/lib/typescript/components/types';

type SelectProps = ISelectProps & {
  label: string;
  labelColor?: ColorType;
  options: React.ReactNode;
  control: Control<any>;
  index: number;
  name: string;
};

export function SelectWithLabelControlled({
  label,
  labelColor = 'gray.750',
  options,
  control,
  index,
  name,
  ...rest
}: SelectProps) {
  const { colors } = useTheme();

  return (
    <Controller
      control={control}
      name={`respostas.${index}.${name}`}
      render={({ field }) => (
        <View>
          <Text mb={3} color={labelColor}>
            {label}
          </Text>
          <NativeBaseSelect
            selectedValue={field?.value}
            onValueChange={field.onChange}
            variant="underlined"
            backgroundColor="transparent"
            size="md"
            fontSize="md"
            dropdownCloseIcon={
              <MaterialCommunityIcons
                name="chevron-down"
                color={colors.gray[700]}
                size={32}
              />
            }
            dropdownOpenIcon={
              <MaterialCommunityIcons
                name="chevron-up"
                color={colors.gray[700]}
                size={32}
              />
            }
            {...rest}
          >
            {options}
          </NativeBaseSelect>
        </View>
      )}
    />
  );
}
