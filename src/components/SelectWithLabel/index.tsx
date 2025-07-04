import {
  type ISelectProps,
  Select as NativeBaseSelect,
  Text,
  View,
  useTheme,
} from 'native-base';
import React from 'react';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ColorType } from 'native-base/lib/typescript/components/types';

type SelectProps = ISelectProps & {
  label: string;
  labelColor?: ColorType;
  options: React.ReactNode;
};

export function SelectWithLabel({
  label,
  labelColor = 'gray.750',
  options,
  ...rest
}: SelectProps) {
  const { colors } = useTheme();

  return (
    <View>
      <Text mb={3} color={labelColor}>
        {label}
      </Text>
      <NativeBaseSelect
        {...rest}
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
      >
        {options}
      </NativeBaseSelect>
    </View>
  );
}
