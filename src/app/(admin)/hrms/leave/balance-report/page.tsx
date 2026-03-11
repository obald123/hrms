import type { Metadata } from "next";
import MigratedFeaturePage from "@/components/migration/MigratedFeaturePage";

export const metadata: Metadata = {
  title: "Hrms / Leave / Balance report"
};

export default function Page() {
  return <MigratedFeaturePage title="Hrms / Leave / Balance report" route="/hrms/leave/balance-report" />;
}
