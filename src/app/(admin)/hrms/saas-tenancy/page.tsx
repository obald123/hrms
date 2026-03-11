import type { Metadata } from "next";
import MigratedFeaturePage from "@/components/migration/MigratedFeaturePage";

export const metadata: Metadata = {
  title: "Hrms / Saas tenancy"
};

export default function Page() {
  return <MigratedFeaturePage title="Hrms / Saas tenancy" route="/hrms/saas-tenancy" />;
}
