import type { Metadata } from "next";
import MigratedFeaturePage from "@/components/migration/MigratedFeaturePage";

export const metadata: Metadata = {
  title: "Hrms / Dms / Ai intelligence"
};

export default function Page() {
  return <MigratedFeaturePage title="Hrms / Dms / Ai intelligence" route="/hrms/dms/ai-intelligence" />;
}
