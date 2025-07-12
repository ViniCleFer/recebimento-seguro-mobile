import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="divergency/[type]" />
      <Stack.Screen name="specification/[type]" />
      <Stack.Screen name="enunciado/[id]" />
      {/* <Stack.Screen name="form-ptp" /> */}
      <Stack.Screen name="carta-controle" />
      <Stack.Screen name="laudo-crm/[id]" />
      <Stack.Screen name="select-divergency-type" />
    </Stack>
  );
}
