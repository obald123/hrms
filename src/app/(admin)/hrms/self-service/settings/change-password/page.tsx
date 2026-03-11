import type { Metadata } from "next";
import MigratedFeaturePage from "@/components/migration/MigratedFeaturePage";

export const metadata: Metadata = {
  title: "Hrms / Self service / Settings / Change password"
};

export default function Page() {
  return <MigratedFeaturePage title="Hrms / Self service / Settings / Change password" route="/hrms/self-service/settings/change-password" />;
}
