import type { Metadata } from "next";
import MigratedFeaturePage from "@/components/migration/MigratedFeaturePage";

export const metadata: Metadata = {
  title: "Hrms / Workforce planning"
};

export default function Page() {
  return <MigratedFeaturePage title="Hrms / Workforce planning" route="/hrms/workforce-planning" />;
}
