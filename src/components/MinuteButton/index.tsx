import { colors } from '@/styles/theme';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type TouchableOpacityProps,
} from 'react-native';

type MinuteButtonProps = TouchableOpacityProps & {
  status: 'loading' | 'signed' | 'unsigned';
};

export const MinuteButton = ({
  status = 'loading',
  style,
  ...rest
}: MinuteButtonProps) => {
  const getButtonStyle = () => {
    switch (status) {
      case 'unsigned':
        return [styles.button, styles.solidButton];
      case 'signed':
        return [styles.button, styles.outlineButton, styles.signedButton];
      default:
        return [styles.button, styles.outlineButton];
    }
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      disabled={status === 'signed' || status === 'loading'}
      {...rest}
    >
      {status === 'loading' && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>VERIFICANDO ASSINATURA</Text>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}
      {status === 'signed' && (
        <Text style={styles.signedText}>DOCUMENTO ASSINADO</Text>
      )}
      {status === 'unsigned' && (
        <Text style={styles.unsignedText}>ASSINAR DOCUMENTO</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minWidth: 210,
    minHeight: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  solidButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  outlineButton: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
  },
  signedButton: {
    borderColor: colors.success,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: colors.primary,
  },
  signedText: {
    fontSize: 14,
    color: colors.success,
  },
  unsignedText: {
    fontSize: 14,
    color: colors.white,
  },
});
