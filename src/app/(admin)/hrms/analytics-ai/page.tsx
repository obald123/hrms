import type { Metadata } from "next";
import MigratedFeaturePage from "@/components/migration/MigratedFeaturePage";

export const metadata: Metadata = {
  title: "Hrms / Analytics ai"
};

export default function Page() {
  return <MigratedFeaturePage title="Hrms / Analytics ai" route="/hrms/analytics-ai" />;
}
