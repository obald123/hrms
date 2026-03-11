"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ComponentCard from "@/components/common/ComponentCard";
import { ApiClientError } from "@/lib/api-client";
import { atsService, type CareerApplicationPayload, type CareerJob } from "@/lib/services/ats";

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const raw = String(reader.result ?? "");
      const base64 = raw.includes(",") ? raw.split(",").pop() ?? "" : raw;
      if (!base64) {
        reject(new Error("Failed to encode file."));
        return;
      }
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });

export default function CareerJobPage() {
  const params = useParams<{ jobId: string }>();
  const jobId = params?.jobId ?? "";

  const [job, setJob] = useState<CareerJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError("");
        if (!jobId) return;
        const data = await atsService.getCareerJob(jobId);
        setJob(data);
      } catch (err) {
        if (err instanceof ApiClientError) {
          setError(err.message);
        } else {
          setError("Failed to load job details.");
        }
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [jobId]);

  const validationError = useMemo(() => {
    if (!firstName.trim()) return "First name is required.";
    if (!lastName.trim()) return "Last name is required.";
    if (!email.trim()) return "Email is required.";
    if (!resumeFile) return "Resume file is required.";
    if (!coverLetterFile) return "Cover letter file is required.";
    return "";
  }, [firstName, lastName, email, resumeFile, coverLetterFile]);

  const submit = async () => {
    setError("");
    setSuccess("");

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!resumeFile || !coverLetterFile) {
      setError("Resume and cover letter are required.");
      return;
    }

    try {
      setSubmitting(true);
      const [resumeBase64, coverLetterBase64] = await Promise.all([toBase64(resumeFile), toBase64(coverLetterFile)]);

      const payload: CareerApplicationPayload = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        ...(phone.trim() ? { phone: phone.trim() } : {}),
        resume_file_name: resumeFile.name,
        resume_file_base64: resumeBase64,
        cover_letter_file_name: coverLetterFile.name,
        cover_letter_file_base64: coverLetterBase64,
        ...(resumeFile.type ? { resume_mime_type: resumeFile.type } : {}),
        ...(coverLetterFile.type ? { cover_letter_mime_type: coverLetterFile.type } : {})
      };

      await atsService.applyCareer(jobId, payload);
      setSuccess("Application submitted successfully.");
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("Failed to submit application.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <ComponentCard title="Career Application">
        <Link href="/careers" className="text-xs text-brand-500 hover:text-brand-600">
          Back to careers
        </Link>
      </ComponentCard>

      <ComponentCard title={job?.title ?? "Job Details"}>
        {loading ? <p className="text-sm text-gray-500">Loading job details...</p> : null}
        {!loading && !job ? <p className="text-sm text-red-500">{error || "Job not found."}</p> : null}
        {job ? (
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p>{job.department.name} / {job.position.title}</p>
            <p>{job.location}</p>
            <p className="whitespace-pre-wrap">{job.description}</p>
          </div>
        ) : null}
      </ComponentCard>

      <ComponentCard title="Apply">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className="h-11 rounded-lg border border-gray-300 px-4 text-sm" />
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" className="h-11 rounded-lg border border-gray-300 px-4 text-sm" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="h-11 rounded-lg border border-gray-300 px-4 text-sm md:col-span-2" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (optional)" className="h-11 rounded-lg border border-gray-300 px-4 text-sm md:col-span-2" />
          <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)} className="h-11 rounded-lg border border-gray-300 px-3 text-sm" />
          <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={(e) => setCoverLetterFile(e.target.files?.[0] ?? null)} className="h-11 rounded-lg border border-gray-300 px-3 text-sm" />
        </div>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        {success ? <p className="text-sm text-green-600">{success}</p> : null}
        <button
          type="button"
          onClick={() => void submit()}
          disabled={submitting}
          className="inline-flex rounded-lg bg-brand-500 px-4 py-2 text-sm text-white hover:bg-brand-600 disabled:opacity-60"
        >
          Submit Application
        </button>
      </ComponentCard>
    </div>
  );
}
