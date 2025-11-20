import { Redirect } from 'expo-router';
import React from 'react';

export default function Page() {
  console.log('MainLayout AQUI');

  return <Redirect href={'/(auth)'} />;
}
