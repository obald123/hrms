import type { Metadata } from "next";
import MigratedFeaturePage from "@/components/migration/MigratedFeaturePage";

export const metadata: Metadata = {
  title: "Hrms / Dms / Access control"
};

export default function Page() {
  return <MigratedFeaturePage title="Hrms / Dms / Access control" route="/hrms/dms/access-control" />;
}
