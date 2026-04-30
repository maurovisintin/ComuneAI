import { useLocalSearchParams } from "expo-router";
import { findTenant, type Tenant } from "@/tenants/config";

export function useCurrentTenant(): Tenant | null {
  const { tenant } = useLocalSearchParams<{ tenant?: string }>();
  return findTenant(tenant) ?? null;
}
