import React from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ScrollViewProps,
} from 'react-native';

import { colors } from '@/styles/theme';

import { Header } from '../Header';

type ContainerProps = ScrollViewProps & {
  subtitle?: string;
};

export const ScrollScreenContainer = ({
  children,
  subtitle = '',
  style,
  contentContainerStyle,
  ...rest
}: ContainerProps) => {
  const { width } = Dimensions.get('window');

  return (
    <View style={[styles.container, { maxWidth: width }, style]} {...rest}>
      <Header />
      {subtitle && (
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitleText}>{subtitle}</Text>
        </View>
      )}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.contentContainer,
            { maxWidth: width },
            contentContainerStyle,
          ]}
          {...rest}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  subtitleContainer: {
    backgroundColor: colors.white,
    padding: 20,
    justifyContent: 'center',
  },
  subtitleText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 22,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: colors.white,
    padding: 10,
  },
});
