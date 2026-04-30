import AsyncStorage from "@react-native-async-storage/async-storage";
import { findTenant } from "./config";

const KEY = "selected_tenant_slug";

export async function getStoredTenantSlug(): Promise<string | null> {
  const slug = await AsyncStorage.getItem(KEY);
  return slug && findTenant(slug) ? slug : null;
}

export async function setStoredTenantSlug(slug: string): Promise<void> {
  await AsyncStorage.setItem(KEY, slug);
}

export async function clearStoredTenantSlug(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
