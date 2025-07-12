import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
} from 'react-native';

type ButtonProps = TouchableOpacityProps & {
  title: string;
  variant?: 'solid' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  textStyle?: any;
};

export const Button = ({
  title,
  variant = 'solid',
  size = 'md',
  textStyle,
  style,
  ...rest
}: ButtonProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.button, styles[variant], styles[size], style]}
      {...rest}
    >
      <Text style={[styles.text, styles[`${variant}Text`], textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    width: '100%',
  },
  solid: {
    backgroundColor: '#084077',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#084077',
  },
  sm: {
    height: 40,
    paddingHorizontal: 16,
  },
  md: {
    height: 48,
    paddingHorizontal: 24,
  },
  lg: {
    height: 56,
    paddingHorizontal: 32,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  solidText: {
    color: 'white',
  },
  outlineText: {
    color: '#084077',
  },
});
