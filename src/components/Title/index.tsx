import React from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';

export default function Title({ children, style, ...rest }: TextProps) {
  return (
    <Text style={[styles.title, style]} {...rest}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    color: '#084077',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
