import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Creatable from "react-select/creatable";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

const CreateJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [selectedOption, setSelectedOption] = useState(null);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");

  // Fetch company profile and auto-populate form
  useEffect(() => {
    if (user?.email) {
      fetch(
        `${import.meta.env.VITE_API_URL}/company-profile/${encodeURIComponent(
          user.email
        )}`
      )
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          return null;
        })
        .then((profile) => {
          if (profile) {
            setCompanyProfile(profile);
            // Auto-populate company fields
            setValue("companyName", profile.companyName || "");
            setValue("companyLogo", profile.companyLogo || "");
          }
        })
        .catch(() => {
          // No company profile found, that's okay
        });
    }
  }, [user?.email, setValue]);

  const onSubmit = (data) => {
    // Validate company profile data
    if (!companyProfile || !companyProfile.companyName) {
      alert("Please create your company profile first before posting a job.");
      return;
    }

    data.skills = selectedOption;
    data.postedBy = user?.email; // Ensure current user's email is used
    data.description = jobDescription; // Use controlled description value
    data.companyName = companyProfile.companyName; // Ensure company name from profile
    data.companyLogo = companyProfile.companyLogo || ""; // Ensure company logo from profile

    console.log("Posting job with data:", data);
    fetch(`${import.meta.env.VITE_API_URL}/post-job`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.acknowledged === true) {
          alert("Job posted successfully!");
          navigate("/my-job");
        }
        reset();
      });
  };

  const options = [
    {
      value: "Java",
      label: "Java",
    },
    {
      value: "JavaScript",
      label: "JavaScript",
    },
    {
      value: "Python",
      label: "Python",
    },
    {
      value: "React",
      label: "React",
    },
    {
      value: "Node.js",
      label: "Node.js",
    },
    {
      value: "CSS",
      label: "CSS",
    },
    {
      value: "HTML",
      label: "HTML",
    },
    {
      value: "SQL",
      label: "SQL",
    },
    {
      value: "C++",
      label: "C++",
    },
    {
      value: "Ruby",
      label: "Ruby",
    },
    {
      value: "PHP",
      label: "PHP",
    },
    {
      value: "Swift",
      label: "Swift",
    },
  ];
  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <div className="bg-[#fafafa] py-10 px-4 lg:px-16">
        {!companyProfile && (
          <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            <strong>Note:</strong> Please create your company profile first to
            auto-populate company details.
            <a href="/company-profile" className="text-blue-600 underline ml-2">
              Create Company Profile
            </a>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="create-job-flex ">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Job Title</label>
              <input
                className="create-job-input"
                type="text"
                defaultValue={"Web Developer"}
                {...register("jobTitle")}
              />
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Company Name</label>
              <input
                className="create-job-input bg-gray-100 cursor-not-allowed"
                type="text"
                placeholder={
                  companyProfile?.companyName ||
                  "Please create company profile first"
                }
                {...register("companyName")}
                readOnly
                value={companyProfile?.companyName || ""}
              />
              <p className="text-xs text-gray-500 mt-1">
                Auto-filled from company profile (read-only)
              </p>
            </div>
          </div>
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Minimum Salary</label>
              <input
                className="create-job-input"
                type="text"
                placeholder="₹ 20k"
                {...register("minPrice")}
              />
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Maximum Salary</label>
              <input
                className="create-job-input"
                type="text"
                placeholder="₹ 130k"
                {...register("maxPrice")}
              />
            </div>
          </div>
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Salary Type</label>
              <select {...register("salaryType")} className="create-job-input">
                <option value="">Choose your salary</option>
                <option value="Hourly">Hourly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Job Location</label>
              <input
                className="create-job-input"
                type="text"
                placeholder="Ex: Gurugram"
                {...register("jobLocation")}
              />
            </div>
          </div>
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Job Posting Date</label>
              <input
                className="create-job-input"
                type="date"
                placeholder="Ex: 15-07-2025"
                {...register("postingDate")}
              />
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Experience Level</label>
              <select
                {...register("experienceLevel")}
                className="create-job-input"
              >
                <option value="">Select your experience level</option>
                <option value="NoExperience">No experience</option>
                <option value="Internship">Internship</option>
                <option value="Work remotely">Work remotely</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block mb-2 text-lg">Required Skill Sets:</label>
            <Creatable
              onChange={setSelectedOption}
              options={options}
              isMulti
              className="create-job-input pr-2"
            />
          </div>
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Company Logo</label>
              <input
                className="create-job-input bg-gray-100 cursor-not-allowed"
                type="url"
                placeholder={
                  companyProfile?.companyLogo ||
                  "Please add logo in company profile"
                }
                {...register("companyLogo")}
                readOnly
                value={companyProfile?.companyLogo || ""}
              />
              <p className="text-xs text-gray-500 mt-1">
                Auto-filled from company profile (read-only)
              </p>
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Employment Type</label>
              <select
                {...register("employmentType")}
                className="create-job-input"
              >
                <option value="">Select your employment type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Temporary">Temporary</option>
              </select>
            </div>
          </div>
          <div className="w-full">
            <label className="block mb-2 text-lg">Job Description</label>
            <textarea
              className="w-full pl-3 py-1.5 focus:outline-none placeholder:text-gray-600 bg-white border border-gray-300 rounded"
              rows={6}
              placeholder="Describe the job role, responsibilities, requirements, and benefits..."
              maxLength="500"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              {...register("description", {
                onChange: (e) => setJobDescription(e.target.value),
                value: jobDescription,
              })}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">
                Provide a concise description of the role and key requirements
              </p>
              <p
                className={`text-xs ${
                  jobDescription.length > 1000
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {jobDescription.length}/1000 characters
              </p>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-lg">Job Posted By</label>
            <input
              className="w-full create-job-input bg-gray-100 cursor-not-allowed"
              type="email"
              value={user?.email || ""}
              placeholder="Your email"
              disabled
              {...register("postedBy")}
            />
            <p className="text-xs text-gray-500 mt-1">
              Auto-filled with your account email (read-only)
            </p>
          </div>
          <input
            type="submit"
            className="block mt-12 bg-blue text-white font-semibold px-8 py-2 rounded-sm cursor-pointer"
          />
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
