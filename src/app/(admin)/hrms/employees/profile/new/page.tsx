import type { Metadata } from "next";
import MigratedFeaturePage from "@/components/migration/MigratedFeaturePage";

export const metadata: Metadata = {
  title: "Hrms / Employees / Profile / New"
};

export default function Page() {
  return <MigratedFeaturePage title="Hrms / Employees / Profile / New" route="/hrms/employees/profile/new" />;
}
