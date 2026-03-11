import type { Metadata } from "next";
import MigratedFeaturePage from "@/components/migration/MigratedFeaturePage";

export const metadata: Metadata = {
  title: "Hrms / Leave / Approval list"
};

export default function Page() {
  return <MigratedFeaturePage title="Hrms / Leave / Approval list" route="/hrms/leave/approval-list" />;
}
