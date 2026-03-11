import type { Metadata } from "next";
import MigratedFeaturePage from "@/components/migration/MigratedFeaturePage";

export const metadata: Metadata = {
  title: "Settings"
};

export default function Page() {
  return <MigratedFeaturePage title="Settings" route="/settings" />;
}
