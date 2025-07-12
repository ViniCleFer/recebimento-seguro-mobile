import { colors } from '@/styles/theme';
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

type InputProps = TextInputProps & {
  label: string;
  labelColor?: string;
  control: Control<any>;
  index: number;
  name: string;
  maxLength?: number;
};

export function InputWithLabelControlled({
  label,
  labelColor = colors.gray750,
  control,
  index,
  name,
  maxLength = 100,
  style,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <Controller
      control={control}
      name={`respostas.${index}.${name}`}
      render={({ field }) => (
        <View style={styles.container}>
          <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
          <TextInput
            value={field?.value}
            onChangeText={field.onChange}
            style={[
              styles.input,
              style,
              isFocused && {
                borderBottomColor: colors.primary,
                borderBottomWidth: 2,
              },
            ]}
            maxLength={maxLength}
            placeholderTextColor={colors.gray700}
            autoComplete="off"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...rest}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    minHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray500,
    fontSize: 16,
    paddingBottom: 8,
    paddingHorizontal: 0,
  },
});
