import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Redirect, router, Slot, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, AppState, View } from 'react-native';

export default function Index() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // supabase.auth.getSession().then(({ data: { session } }) => {
    //   setSession(session);
    //   setLoading(false);
    //   console.log('session', session);

    //   return session;
    // });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log('authListener index', session);

        setLoading(false);
        setSession(session);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={'#2e2efe'} size="large" />
      </View>
    );
  }

  console.log('index', session);

  if (session !== null) {
    return <Redirect href="/(home)/dashboard" />;
  }

  return <Redirect href="/(auth)/sign-in" />;
}
