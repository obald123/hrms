import type { Metadata } from "next";
import MigratedFeaturePage from "@/components/migration/MigratedFeaturePage";

export const metadata: Metadata = {
  title: "Hrms / Compliance"
};

export default function Page() {
  return <MigratedFeaturePage title="Hrms / Compliance" route="/hrms/compliance" />;
}
