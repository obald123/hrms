import type { Metadata } from "next";
import MigratedFeaturePage from "@/components/migration/MigratedFeaturePage";

export const metadata: Metadata = {
  title: "Hrms / Self service"
};

export default function Page() {
  return <MigratedFeaturePage title="Hrms / Self service" route="/hrms/self-service" />;
}
