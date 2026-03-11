import type { Metadata } from "next";
import MigratedFeaturePage from "@/components/migration/MigratedFeaturePage";

export const metadata: Metadata = {
  title: "Settings / Config"
};

export default function Page() {
  return <MigratedFeaturePage title="Settings / Config" route="/settings/config" />;
}
