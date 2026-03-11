import type { Metadata } from "next";
import MigratedFeaturePage from "@/components/migration/MigratedFeaturePage";

export const metadata: Metadata = {
  title: "Hrms / Mobile apps"
};

export default function Page() {
  return <MigratedFeaturePage title="Hrms / Mobile apps" route="/hrms/mobile-apps" />;
}
