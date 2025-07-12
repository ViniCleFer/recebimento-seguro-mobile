import { colors } from '@/styles/theme';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  type ViewProps,
} from 'react-native';

type LoadingProps = ViewProps;

export const Loading = ({ style, ...rest }: LoadingProps) => {
  return (
    <View style={[styles.container, style]} {...rest}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});
