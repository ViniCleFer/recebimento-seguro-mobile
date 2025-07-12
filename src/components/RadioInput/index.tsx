import { colors } from '@/styles/theme';
import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  type TouchableOpacityProps,
} from 'react-native';

type InputProps = TouchableOpacityProps & {
  children: React.ReactNode;
  value: string;
  isSelected?: boolean;
  onSelect?: (value: string) => void;
};

export function RadioInput({
  value,
  isSelected = false,
  onSelect,
  style,
  children,
  ...rest
}: InputProps) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onSelect?.(value)}
      activeOpacity={0.7}
      {...rest}
    >
      <View style={[styles.radio, isSelected && styles.radioSelected]}>
        {isSelected && <View style={styles.radioInner} />}
      </View>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.gray500,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 4,
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});
