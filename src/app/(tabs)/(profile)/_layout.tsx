import '@/lib/dayjs';
import 'intl';
import 'intl/locale-data/jsonp/en';

import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
