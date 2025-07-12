import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  type ViewProps,
} from 'react-native';

import { CustomBottomTab } from '../CustomBottomTab';
import { Header } from '../Header';

type ContainerProps = ViewProps & {
  subtitle?: string;
  footerActive?: boolean;
};

export const ScreenContainer = ({
  children,
  subtitle = '',
  footerActive = true,
  style,
  ...rest
}: ContainerProps) => {
  const { width } = Dimensions.get('window');
  const navigation = useNavigation();

  return (
    <View
      style={[
        styles.container,
        {
          maxWidth: width,
          marginTop: !footerActive ? -100 : 0,
        },
        style,
      ]}
      {...rest}
    >
      <Header zIndex={subtitle ? 0 : 999} />
      {subtitle && (
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitleText}>{subtitle}</Text>
        </View>
      )}
      <View style={[styles.content, { maxWidth: width }]}>{children}</View>
      {footerActive && <CustomBottomTab navigation={navigation} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  subtitleContainer: {
    backgroundColor: '#084077',
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 999,
  },
  subtitleText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
});
