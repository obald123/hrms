import type { Metadata } from "next";
import MigratedFeaturePage from "@/components/migration/MigratedFeaturePage";

export const metadata: Metadata = {
  title: "Hrms / Self service / Attendance"
};

export default function Page() {
  return <MigratedFeaturePage title="Hrms / Self service / Attendance" route="/hrms/self-service/attendance" />;
}
