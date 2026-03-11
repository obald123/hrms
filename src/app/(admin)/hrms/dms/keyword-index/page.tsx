import type { Metadata } from "next";
import MigratedFeaturePage from "@/components/migration/MigratedFeaturePage";

export const metadata: Metadata = {
  title: "Hrms / Dms / Keyword index"
};

export default function Page() {
  return <MigratedFeaturePage title="Hrms / Dms / Keyword index" route="/hrms/dms/keyword-index" />;
}
