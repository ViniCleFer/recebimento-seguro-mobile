import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
  console.log('Index Auth');

  return <Redirect href={'/(auth)/sign-in'} />;
}
