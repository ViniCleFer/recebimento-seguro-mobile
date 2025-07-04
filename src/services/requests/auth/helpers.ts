import AsyncStorage from '@react-native-async-storage/async-storage';

import { type User } from '../users/types';
import { type Tokens } from './types';

export async function getDataInLocalStorage(key: string | null) {
  if (!key || key === null) {
    return null;
  }

  const dataString = await AsyncStorage.getItem(key);

  if (!dataString || dataString === null) {
    return null;
  }

  const json = JSON.parse(dataString);

  return json;
}

export async function setUserLocalStorage(user: any | null) {
  await AsyncStorage.setItem('@ptpapp:u', JSON.stringify(user));
}

export async function setTokensLocalStorage(tokens: Tokens | null) {
  await AsyncStorage.setItem('@ptpapp:t', JSON.stringify(tokens));
}

export async function getUserLocalStorage(): Promise<User> {
  const user = await getDataInLocalStorage('@ptpapp:u');

  return user;
}

export async function getTokensLocalStorage(): Promise<Tokens> {
  const tokens = await getDataInLocalStorage('@ptpapp:t');

  return tokens;
}

export async function clearUserLocalStorage(): Promise<void> {
  await AsyncStorage.removeItem('@ptpapp:u');
}

export async function clearTokensLocalStorage(): Promise<void> {
  await AsyncStorage.removeItem('@ptpapp:t');
}
