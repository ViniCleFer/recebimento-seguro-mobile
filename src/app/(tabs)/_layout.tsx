import { FontAwesome } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';

import useAuthStore from '@/store/auth';

export default function MainLayout() {
  const { signed } = useAuthStore(state => state);

  if (!signed) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarActiveTintColor: '#084077',
      }}
    >
      <Tabs.Screen
        name="(list)"
        options={{
          title: 'Listar',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="list" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(register)"
        options={{
          title: 'Cadastrar',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="sticky-note" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
