"use client";

import { useState } from "react";

interface Stage {
  name: string;
  order: number;
}

interface JobForm {
  department_id: string;
  position_id: string;
  title: string;
  description: string;
  employment_type: string;
  location: string;
  salary_range_min: string;
  salary_range_max: string;
  stages: Stage[];
}

const mockDepartments = [
  { id: "11111111-1111-1111-1111-111111111111", name: "Engineering" },
  { id: "22222222-2222-2222-2222-222222222222", name: "Design" },
  { id: "33333333-3333-3333-3333-333333333333", name: "Product" },
  { id: "44444444-4444-4444-4444-444444444444", name: "Analytics" },
  { id: "55555555-5555-5555-5555-555555555555", name: "Sales" },
  { id: "66666666-6666-6666-6666-666666666666", name: "Marketing" },
  { id: "77777777-7777-7777-7777-777777777777", name: "HR" },
  { id: "88888888-8888-8888-8888-888888888888", name: "Operations" },
];

const mockPositions = [
  { id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", name: "Senior Backend Engineer" },
  { id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", name: "Frontend Developer" },
  { id: "cccccccc-cccc-cccc-cccc-cccccccccccc", name: "UX Designer" },
  { id: "dddddddd-dddd-dddd-dddd-dddddddddddd", name: "Product Manager" },
  { id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee", name: "Data Analyst" },
  { id: "ffffffff-ffff-ffff-ffff-ffffffffffff", name: "DevOps Engineer" },
];

const stageTemplates = [
  { name: "Screening", order: 1 },
  { name: "Technical Interview", order: 2 },
  { name: "Final Interview", order: 3 },
];

export default function AddJobPage() {
  const [formData, setFormData] = useState<JobForm>({
    department_id: "",
    position_id: "",
    title: "",
    description: "",
    employment_type: "PERMANENT",
    location: "",
    salary_range_min: "",
    salary_range_max: "",
    stages: stageTemplates,
  });

  const [submitted, setSubmitted] = useState(false);
  const [newStageName, setNewStageName] = useState("");

  const employmentTypes = ["PERMANENT", "CONTRACT", "TEMPORARY", "INTERNSHIP"];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddStage = () => {
    if (newStageName.trim()) {
      const newOrder = Math.max(...formData.stages.map(s => s.order), 0) + 1;
      setFormData((prev) => ({
        ...prev,
        stages: [...prev.stages, { name: newStageName, order: newOrder }],
      }));
      setNewStageName("");
    }
  };

  const handleRemoveStage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      stages: prev.stages.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const payload = {
      department_id: formData.department_id,
      position_id: formData.position_id,
      title: formData.title,
      description: formData.description,
      employment_type: formData.employment_type,
      location: formData.location,
      salary_range_min: parseInt(formData.salary_range_min),
      salary_range_max: parseInt(formData.salary_range_max),
      status: "PENDING_APPROVAL",
      stages: formData.stages,
    };

    console.log("Sending to backend:", payload);
    
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        department_id: "",
        position_id: "",
        title: "",
        description: "",
        employment_type: "PERMANENT",
        location: "",
        salary_range_min: "",
        salary_range_max: "",
        stages: stageTemplates,
      });
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-default dark:border-gray-700 dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Add New Job Posting
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Create a new job opening for your organization
        </p>
      </div>

      {/* Form */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-default dark:border-gray-700 dark:bg-gray-800 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Department and Position Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Department & Position
            </label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="department_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  id="department_id"
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  required
                  className="w-full h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  <option value="">-- Select Department --</option>
                  {mockDepartments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="position_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Position <span className="text-red-500">*</span>
                </label>
                <select
                  id="position_id"
                  name="position_id"
                  value={formData.position_id}
                  onChange={handleChange}
                  required
                  className="w-full h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  <option value="">-- Select Position --</option>
                  {mockPositions.map((pos) => (
                    <option key={pos.id} value={pos.id}>
                      {pos.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Basic Information</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Senior Backend Engineer"
                  className="w-full h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Riyadh, Saudi Arabia"
                  className="w-full h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500"
                />
              </div>

              <div>
                <label htmlFor="employment_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Employment Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="employment_type"
                  name="employment_type"
                  value={formData.employment_type}
                  onChange={handleChange}
                  required
                  className="w-full h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  {employmentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div></div>
            </div>
          </div>

          {/* Salary Information */}
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Salary Information</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="salary_range_min" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Salary <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="salary_range_min"
                  name="salary_range_min"
                  value={formData.salary_range_min}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 12000"
                  className="w-full h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500"
                />
              </div>

              <div>
                <label htmlFor="salary_range_max" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Salary <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="salary_range_max"
                  name="salary_range_max"
                  value={formData.salary_range_max}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 18000"
                  className="w-full h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Describe the role, responsibilities, and key expectations..."
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500"
            />
          </div>

          {/* Recruitment Stages */}
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recruitment Stages</h3>
            
            {/* Current Stages */}
            <div className="space-y-2 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              {formData.stages.map((stage, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {stage.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Stage {stage.order}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveStage(index)}
                    className="text-xs font-medium text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Stage */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newStageName}
                onChange={(e) => setNewStageName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddStage();
                  }
                }}
                placeholder="e.g., HR Review, Assessment"
                className="flex-1 h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500"
              />
              <button
                type="button"
                onClick={handleAddStage}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
              >
                Add
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg"
            >
              Post Job Opening
            </button>
            <button
              type="reset"
              className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 px-6 py-2.5 rounded-lg text-sm font-medium transition-all"
              onClick={() => {
                setFormData({
                  department_id: "",
                  position_id: "",
                  title: "",
                  description: "",
                  employment_type: "PERMANENT",
                  location: "",
                  salary_range_min: "",
                  salary_range_max: "",
                  stages: stageTemplates,
                });
                setNewStageName("");
              }}
            >
              Clear Form
            </button>
          </div>

          {/* Success Message */}
          {submitted && (
            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                ✓ Job posting created successfully!
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
