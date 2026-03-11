import type { Metadata } from "next";
import MigratedFeaturePage from "@/components/migration/MigratedFeaturePage";

export const metadata: Metadata = {
  title: "Hrms / Recruitment"
};

export default function Page() {
  return <MigratedFeaturePage title="Hrms / Recruitment" route="/hrms/recruitment" />;
}
