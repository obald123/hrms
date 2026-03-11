import type { Metadata } from "next";
import MigratedFeaturePage from "@/components/migration/MigratedFeaturePage";

export const metadata: Metadata = {
  title: "Hrms / Leave / Policies"
};

export default function Page() {
  return <MigratedFeaturePage title="Hrms / Leave / Policies" route="/hrms/leave/policies" />;
}
