import 'intl';
import 'intl/locale-data/jsonp/en';
import '@/lib/dayjs';

import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="forms-ptp-list" />
      <Stack.Screen name="divergencies-list" />
      <Stack.Screen name="laudos-crm-list" />
      <Stack.Screen name="carta-controle/edit/[id]" />
    </Stack>
  );
}
