import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
  console.log('Index Tab');

  return <Redirect href={'/(tabs)/(list)'} />;
}
