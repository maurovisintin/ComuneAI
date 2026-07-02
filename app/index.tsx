import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

import { getStoredTenantSlug } from "@/tenants/storage";

type BootState =
  | { status: "loading" }
  | { status: "select" }
  | { status: "tenant"; slug: string };

export default function Boot() {
  const [state, setState] = useState<BootState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const slug = await getStoredTenantSlug();
      if (cancelled) return;
      setState(slug ? { status: "tenant", slug } : { status: "select" });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "loading") return null;
  if (state.status === "select") return <Redirect href="/welcome" />;
  return <Redirect href={`/${state.slug}`} />;
}
