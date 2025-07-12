import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function MainLayout() {
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
