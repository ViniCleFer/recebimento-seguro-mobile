import { MaterialIcons } from '@expo/vector-icons';
import { useNavigationState } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  type ViewProps,
} from 'react-native';

// import LogoYpe from '@/assets/ype.png';
import { supabase } from '@/lib/supabase';
import useAuthStore from '@/store/auth';
import { useRouter } from 'expo-router';
// import useFactoryPlantStore from '../../store/factories';

interface HeaderProps extends ViewProps {
  zIndex?: number;
}

export const Header = ({ zIndex = 1, style, ...rest }: HeaderProps) => {
  const navigationState = useNavigationState(state => state);

  const { width } = useWindowDimensions();

  const router = useRouter();

  const { user, setUserAuthenticated, setSigned } = useAuthStore(
    state => state,
  );

  const [hasNavigation, setHasNavigation] = useState(false);

  useEffect(() => {
    if (navigationState && navigationState?.index > 0) {
      setHasNavigation(true);
    } else {
      setHasNavigation(false);
    }
  }, [navigationState]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert('Erro ao sair', 'Por favor, tente novamente mais tarde');

      console.error('Error logging out:', error.message);
      return;
    }

    setUserAuthenticated(null, null);
    setSigned(false);
    // router.replace('/(auth)');
  }, [setUserAuthenticated, setSigned]);

  return (
    <View
      style={[
        styles.container,
        {
          width: width,
          maxWidth: width,
          zIndex: zIndex,
          paddingTop: Platform.OS === 'android' ? 36 : 70,
        },
        style,
      ]}
      {...rest}
    >
      <View style={styles.leftSection}>
        {hasNavigation && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons
              name={'arrow-back-ios'}
              size={20}
              color={'#bdbdbd'}
            />
          </TouchableOpacity>
        )}

        {hasNavigation ? (
          <Text style={styles.userName}>
            {user?.user_metadata?.name
              ? user?.user_metadata?.name?.split(' ')?.length > 2
                ? user?.user_metadata?.name?.split(' ')[0]
                : user?.user_metadata?.name
              : 'Admin'}
          </Text>
        ) : (
          <View style={styles.userSection}>
            <Text style={styles.userName}>
              {user?.user_metadata?.name
                ? user?.user_metadata?.name?.split(' ')?.length > 2
                  ? user?.user_metadata?.name?.split(' ')[0]
                  : user?.user_metadata?.name
                : 'Admin'}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.rightSection}>
        {/* <Image
          mb={0.5}
          ml={-3}
          mr={-1}
          source={LogoYpe}
          defaultSource={LogoYpe}
          width={16}
          height={16}
          resizeMode="contain"
          alt="logo"
        /> */}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <MaterialIcons name="logout" color={'#084077'} size={28} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingLeft: 14,
    paddingRight: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: 4,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  userSection: {
    width: '75%',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoutButton: {
    padding: 4,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
