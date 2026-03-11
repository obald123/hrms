import type { Metadata } from "next";
import MigratedFeaturePage from "@/components/migration/MigratedFeaturePage";

export const metadata: Metadata = {
  title: "Hrms / Collaboration"
};

export default function Page() {
  return <MigratedFeaturePage title="Hrms / Collaboration" route="/hrms/collaboration" />;
}
