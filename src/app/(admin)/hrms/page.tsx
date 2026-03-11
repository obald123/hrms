import type { Metadata } from "next";
import MigratedFeaturePage from "@/components/migration/MigratedFeaturePage";

export const metadata: Metadata = {
  title: "Hrms"
};

export default function Page() {
  return <MigratedFeaturePage title="Hrms" route="/hrms" />;
}
