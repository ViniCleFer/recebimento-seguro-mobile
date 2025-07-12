import { colors } from '@/styles/theme';
import React from 'react';
import { type Control, Controller, type FieldError } from 'react-hook-form';
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

type InputProps = TextInputProps & {
  control: Control<any>;
  name: string;
  label: string;
  error?: FieldError;
  isWhite?: boolean;
  color?: string;
  marginBottom?: number;
};

export function Input({
  name,
  label,
  control,
  error,
  isWhite = false,
  color,
  marginBottom = 32,
  style,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <View style={[styles.container, { marginBottom }]}>
      <Text style={[styles.label, { color: color || colors.primary }]}>
        {label}
      </Text>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field: { onChange, value, onBlur, ref } }) => (
          <>
            <TextInput
              style={[
                styles.input,
                style,
                isFocused && {
                  borderBottomColor: colors.primary,
                  borderBottomWidth: 2,
                },
              ]}
              value={value}
              onChangeText={onChange}
              onBlur={() => {
                setIsFocused(false);
                onBlur();
              }}
              onFocus={() => setIsFocused(true)}
              ref={ref}
              placeholderTextColor="#9e9e9e"
              {...rest}
            />

            {error && <Text style={styles.errorText}>{error?.message}</Text>}
          </>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 16,
    paddingBottom: 8,
    paddingHorizontal: 0,
  },
  errorText: {
    color: '#ff5757',
    fontSize: 12,
    marginTop: 4,
  },
});
