import type { Metadata } from "next";
import MigratedFeaturePage from "@/components/migration/MigratedFeaturePage";

export const metadata: Metadata = {
  title: "Hrms / Employees / Bulk upload / Preview"
};

export default function Page() {
  return <MigratedFeaturePage title="Hrms / Employees / Bulk upload / Preview" route="/hrms/employees/bulk-upload/preview" />;
}
