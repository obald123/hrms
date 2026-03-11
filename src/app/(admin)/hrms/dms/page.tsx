import type { Metadata } from "next";
import MigratedFeaturePage from "@/components/migration/MigratedFeaturePage";

export const metadata: Metadata = {
  title: "Hrms / Dms"
};

export default function Page() {
  return <MigratedFeaturePage title="Hrms / Dms" route="/hrms/dms" />;
}
