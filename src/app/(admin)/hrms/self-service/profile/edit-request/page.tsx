import type { Metadata } from "next";
import MigratedFeaturePage from "@/components/migration/MigratedFeaturePage";

export const metadata: Metadata = {
  title: "Hrms / Self service / Profile / Edit request"
};

export default function Page() {
  return <MigratedFeaturePage title="Hrms / Self service / Profile / Edit request" route="/hrms/self-service/profile/edit-request" />;
}
