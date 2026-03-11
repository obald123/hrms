import type { Metadata } from "next";
import ComponentCard from "@/components/common/ComponentCard";

export const metadata: Metadata = {
  title: "Forgot Password"
};

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-xl py-10">
      <ComponentCard
        title="Forgot Password"
        desc="Use your backend password reset implementation here. This page is mapped for frontend migration parity."
      >
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Route parity completed for <code>/auth/forgot-password</code>.
        </p>
      </ComponentCard>
    </div>
  );
}
