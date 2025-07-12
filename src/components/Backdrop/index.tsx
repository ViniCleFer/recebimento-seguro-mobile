import React from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  View,
  type ActivityIndicatorProps,
} from 'react-native';

type BackdropProps = ActivityIndicatorProps & {
  visible: boolean;
};

export const Backdrop = ({
  visible,
  color = 'white',
  ...rest
}: BackdropProps) => {
  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <ActivityIndicator color={color} size="large" {...rest} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    backgroundColor: 'rgba(100,100,100,0.3)',
    zIndex: 900,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
