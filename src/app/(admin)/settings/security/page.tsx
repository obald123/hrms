import type { Metadata } from "next";
import MigratedFeaturePage from "@/components/migration/MigratedFeaturePage";

export const metadata: Metadata = {
  title: "Settings / Security"
};

export default function Page() {
  return <MigratedFeaturePage title="Settings / Security" route="/settings/security" />;
}
