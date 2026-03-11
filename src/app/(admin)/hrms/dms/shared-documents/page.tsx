import type { Metadata } from "next";
import MigratedFeaturePage from "@/components/migration/MigratedFeaturePage";

export const metadata: Metadata = {
  title: "Hrms / Dms / Shared documents"
};

export default function Page() {
  return <MigratedFeaturePage title="Hrms / Dms / Shared documents" route="/hrms/dms/shared-documents" />;
}
