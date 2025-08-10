import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Creatable from "react-select/creatable";
import { useLoaderData, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const UpdateJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    _id,
    jobTitle,
    companyName,
    minPrice,
    maxPrice,
    salaryType,
    jobLocation,
    postingDate,
    experienceLevel,
    companyLogo,
    employmentType,
    description,
    postedBy,
    skills,
  } = useLoaderData();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [selectedOption, setSetselectedOption] = useState(null);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [jobDescription, setJobDescription] = useState(description || "");

  // Fetch company profile
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
            // Override with current company profile data
            setValue("companyName", profile.companyName || "");
            setValue("companyLogo", profile.companyLogo || "");
          }
        })
        .catch(() => {
          // No company profile found, keep existing values
        });
    }
  }, [user?.email, setValue]);

  const onSubmit = (data) => {
    data.skills = selectedOption;
    data.description = jobDescription; // Use controlled description value
    data.postedBy = user?.email; // Ensure current user's email is used
    // Use company profile data if available, otherwise keep existing data
    data.companyName = companyProfile?.companyName || companyName;
    data.companyLogo = companyProfile?.companyLogo || companyLogo;

    console.log("Updating job with data:", data);
    fetch(`${import.meta.env.VITE_API_URL}/update-job/${id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("Update result:", result);
        if (result.acknowledged === true || result.modifiedCount > 0) {
          alert("Job updated successfully!");
          // Redirect to job detail page
          navigate(`/job/${id}`);
        } else {
          alert("No changes made to the job.");
        }
      })
      .catch((error) => {
        console.error("Error updating job:", error);
        alert("Failed to update job. Please try again.");
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
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Update Job</h2>
          <p className="text-gray-600">
            Modify job details below. Company information is auto-filled from
            your profile.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="create-job-flex ">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Job Title</label>
              <input
                className="create-job-input"
                type="text"
                defaultValue={jobTitle}
                {...register("jobTitle")}
              />
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">
                Company Name{" "}
                <span className="text-xs text-gray-500 mt-1">
                  This field cannot be changed (read-only)
                </span>
              </label>
              <input
                className="create-job-input bg-gray-100 cursor-not-allowed"
                type="text"
                value={companyProfile?.companyName || companyName || ""}
                placeholder="Company name from profile"
                {...register("companyName")}
                readOnly
              />
            </div>
          </div>
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Minimum Salary</label>
              <input
                className="create-job-input"
                type="text"
                defaultValue={minPrice}
                placeholder="₹ 20k"
                {...register("minPrice")}
              />
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Maximum Salary</label>
              <input
                className="create-job-input"
                type="text"
                defaultValue={maxPrice}
                placeholder="₹ 130k"
                {...register("maxPrice")}
              />
            </div>
          </div>
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Salary Type</label>
              <select
                {...register("salaryType")}
                defaultValue={salaryType}
                className="create-job-input"
              >
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
                defaultValue={jobLocation}
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
                defaultValue={postingDate}
                placeholder="Ex: 15-07-2025"
                {...register("postingDate")}
              />
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Experience Level</label>
              <select
                {...register("experienceLevel")}
                defaultValue={experienceLevel}
                className="create-job-input"
              >
                <option value="NoExperience">No experience</option>
                <option value="Internship">Internship</option>
                <option value="Work remotely">Work remotely</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block mb-2 text-lg">Required Skill Sets:</label>
            <Creatable
              defaultValue={skills}
              onChange={setSetselectedOption}
              options={options}
              isMulti
              className="create-job-input pr-2"
            />
          </div>
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">
                Company Logo{" "}
                <span className="text-xs text-gray-500 mt-1">
                  This field cannot be changed (read-only)
                </span>
              </label>
              <input
                className="create-job-input bg-gray-100 cursor-not-allowed"
                type="url"
                value={companyProfile?.companyLogo || companyLogo || ""}
                placeholder="Company logo from profile"
                {...register("companyLogo")}
                readOnly
              />
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Employment Type</label>
              <select
                {...register("employmentType")}
                defaultValue={employmentType}
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
              className="w-full pl-3 py-1.5 focus:outline-none placeholder:text-gray-600 bg-white rounded border"
              rows={6}
              placeholder="Describe the job role, responsibilities, and requirements in detail..."
              value={jobDescription}
              onChange={(e) => {
                if (e.target.value.length <= 1000) {
                  setJobDescription(e.target.value);
                }
              }}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">
                Provide detailed information about the role and requirements
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
            <label className="block mb-2 text-lg">
              Job Posted By{" "}
              <span className="text-xs text-gray-500 mt-1">
                This field cannot be changed (read-only)
              </span>
            </label>
            <input
              className="w-full create-job-input bg-gray-100 cursor-not-allowed"
              type="email"
              value={user?.email || postedBy || ""}
              placeholder="Your email"
              readOnly
              disabled
            />
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

export default UpdateJob;
