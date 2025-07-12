import { colors } from '@/styles/theme';
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

type InputProps = TextInputProps & {
  label: string;
  error?: string;
  color?: string;
  marginBottom?: number;
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
};

export function InputNormal({
  label,
  error,
  color,
  marginBottom = 32,
  textTransform = 'uppercase',
  style,
  ...rest
}: InputProps) {
  return (
    <View style={[styles.container, { marginBottom }]}>
      <Text
        style={[
          styles.label,
          {
            color: color || colors.primary,
            textTransform: textTransform,
          },
        ]}
      >
        {label}
      </Text>

      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={colors.gray700}
        {...rest}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
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
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray500,
    fontSize: 16,
    paddingBottom: 8,
    paddingHorizontal: 0,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
});
