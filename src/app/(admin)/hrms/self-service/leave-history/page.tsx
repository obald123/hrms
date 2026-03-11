import type { Metadata } from "next";
import MigratedFeaturePage from "@/components/migration/MigratedFeaturePage";

export const metadata: Metadata = {
  title: "Hrms / Self service / Leave history"
};

export default function Page() {
  return <MigratedFeaturePage title="Hrms / Self service / Leave history" route="/hrms/self-service/leave-history" />;
}
