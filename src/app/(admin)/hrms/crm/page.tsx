import type { Metadata } from "next";
import MigratedFeaturePage from "@/components/migration/MigratedFeaturePage";

export const metadata: Metadata = {
  title: "Hrms / Crm"
};

export default function Page() {
  return <MigratedFeaturePage title="Hrms / Crm" route="/hrms/crm/dashboard" />;
}
