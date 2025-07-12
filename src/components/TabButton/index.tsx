import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
} from 'react-native';

type Props = TouchableOpacityProps & {
  title: string;
  isActive?: boolean;
};

export function TabButton({ title, isActive = false, style, ...rest }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, isActive && styles.activeButton, style]}
      {...rest}
    >
      <Text style={[styles.text, isActive && styles.activeText]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    borderRadius: 0,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    borderBottomColor: '#084077',
  },
  text: {
    color: '#9e9e9e',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  activeText: {
    color: '#084077',
  },
});
