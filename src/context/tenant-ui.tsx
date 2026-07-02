import { createContext, useContext } from "react";

export type TenantUIContextValue = {
  openDrawer: () => void;
  /** Open the full-screen voice overlay; onResult fires with the final transcript. */
  openVoice: (onResult: (text: string) => void) => void;
  openStories: () => void;
};

export const TenantUIContext = createContext<TenantUIContextValue | null>(null);

export function useTenantUI(): TenantUIContextValue {
  const value = useContext(TenantUIContext);
  if (!value) {
    throw new Error("useTenantUI must be used inside a tenant layout");
  }
  return value;
}
