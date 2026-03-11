import type { Metadata } from "next";
import MigratedFeaturePage from "@/components/migration/MigratedFeaturePage";

export const metadata: Metadata = {
  title: "Hrms / Leave"
};

export default function Page() {
  return <MigratedFeaturePage title="Hrms / Leave" route="/hrms/leave" />;
}
