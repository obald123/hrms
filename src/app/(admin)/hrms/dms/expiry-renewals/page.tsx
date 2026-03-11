import type { Metadata } from "next";
import MigratedFeaturePage from "@/components/migration/MigratedFeaturePage";

export const metadata: Metadata = {
  title: "Hrms / Dms / Expiry renewals"
};

export default function Page() {
  return <MigratedFeaturePage title="Hrms / Dms / Expiry renewals" route="/hrms/dms/expiry-renewals" />;
}
