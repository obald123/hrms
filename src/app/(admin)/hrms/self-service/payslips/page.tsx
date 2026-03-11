import type { Metadata } from "next";
import MigratedFeaturePage from "@/components/migration/MigratedFeaturePage";

export const metadata: Metadata = {
  title: "Hrms / Self service / Payslips"
};

export default function Page() {
  return <MigratedFeaturePage title="Hrms / Self service / Payslips" route="/hrms/self-service/payslips" />;
}
