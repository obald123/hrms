import type { Metadata } from "next";
import MigratedFeaturePage from "@/components/migration/MigratedFeaturePage";

export const metadata: Metadata = {
  title: "Hrms / Security governance"
};

export default function Page() {
  return <MigratedFeaturePage title="Hrms / Security governance" route="/hrms/security-governance" />;
}
