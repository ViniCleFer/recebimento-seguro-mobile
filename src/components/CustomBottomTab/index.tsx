import { MaterialIcons } from '@expo/vector-icons';
import * as Constants from 'expo-constants';
import { useCallback } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

// import LogoOPS from '@/assets/logo-ops.png';

export const CustomBottomTab = ({ navigation }: any) => {
  const currentVersion = Constants?.default?.expoConfig?.version;

  const handle = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Pressable onPress={handle} style={styles.button}>
        <MaterialIcons name="home" size={28} color="white" />

        <Text style={styles.versionText}>V. {currentVersion}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#084077',
    flex: 1,
    paddingBottom: Platform.OS === 'android' ? 12 : 36,
    alignItems: 'center',
  },
  versionText: {
    position: 'absolute',
    top: 15,
    left: '45%',
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },
});
