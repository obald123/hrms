import { redirect } from "next/navigation";

export default function ResetPasswordAliasPage() {
  redirect("/auth/forgot-password");
}
