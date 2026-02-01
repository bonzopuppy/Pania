import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_NAME: '@pania_user_name',
  HAS_ONBOARDED: '@pania_has_onboarded',
  FLOWS_COMPLETED: '@pania_flows_completed',
  USER_ID: '@pania_user_id',
} as const;

export async function getUserName(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.USER_NAME);
  } catch (error) {
    console.error('Failed to get user name:', error);
    return null;
  }
}

export async function setUserName(name: string): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_NAME, name);
  } catch (error) {
    console.error('Failed to set user name:', error);
  }
}

export async function hasOnboarded(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.HAS_ONBOARDED);
    return value === 'true';
  } catch (error) {
    console.error('Failed to check onboarding status:', error);
    return false;
  }
}

export async function setOnboarded(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.HAS_ONBOARDED, 'true');
  } catch (error) {
    console.error('Failed to set onboarding status:', error);
  }
}

export async function clearOnboarding(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_NAME);
    await AsyncStorage.removeItem(STORAGE_KEYS.HAS_ONBOARDED);
  } catch (error) {
    console.error('Failed to clear onboarding:', error);
  }
}

// ===== Flow Tracking =====

export async function getFlowsCompleted(): Promise<number> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.FLOWS_COMPLETED);
    return value ? parseInt(value, 10) : 0;
  } catch (error) {
    console.error('Failed to get flows completed:', error);
    return 0;
  }
}

export async function incrementFlowsCompleted(): Promise<void> {
  try {
    const current = await getFlowsCompleted();
    await AsyncStorage.setItem(STORAGE_KEYS.FLOWS_COMPLETED, String(current + 1));
  } catch (error) {
    console.error('Failed to increment flows completed:', error);
  }
}

// ===== User ID (for authenticated users) =====

export async function getUserId(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
  } catch (error) {
    console.error('Failed to get user ID:', error);
    return null;
  }
}

export async function setUserId(userId: string): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, userId);
  } catch (error) {
    console.error('Failed to set user ID:', error);
  }
}

export async function clearUserId(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_ID);
  } catch (error) {
    console.error('Failed to clear user ID:', error);
  }
}

// ===== Complete Clear (for logout) =====

export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_NAME,
      STORAGE_KEYS.HAS_ONBOARDED,
      STORAGE_KEYS.FLOWS_COMPLETED,
      STORAGE_KEYS.USER_ID,
    ]);
  } catch (error) {
    console.error('Failed to clear all data:', error);
  }
}
