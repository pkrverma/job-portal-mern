import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import Swal from "sweetalert2";
import PageHeader from "../Component/PageHeader";
import Sidebar from "../jobDetailSidebar/Sidebar";
import Description from "../jobDetailSidebar/Description";
import CompanyDetails from "../jobDetailSidebar/CompanyDetails";
import { useAuth } from "../context/useAuth";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState({});
  const [hasApplied, setHasApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const { user, userRole } = useAuth();

  // Check if current user is the recruiter who posted this job
  const isJobOwner = user?.email === job?.postedBy && userRole === "recruiter";

  useEffect(() => {
    if (!id) return;
    fetch(`${import.meta.env.VITE_API_URL}/all-jobs/${id}`)
      .then((res) => res.json())
      .then((data) => setJob(data))
      .catch(() => {});
  }, [id]);

  // Check if user has already applied for this job (only for job seekers)
  useEffect(() => {
    if (!user?.email || !id || userRole === "recruiter") return;

    fetch(
      `${
        import.meta.env.VITE_API_URL
      }/check-application/${id}/${encodeURIComponent(user.email)}`
    )
      .then((res) => res.json())
      .then((data) => {
        setHasApplied(data.hasApplied || false);
      })
      .catch(() => {});
  }, [user?.email, userRole, id]);

  const handleApply = async () => {
    if (!user) {
      Swal.fire({
        title: "Please log in",
        text: "You need to be logged in to apply for jobs",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    if (hasApplied) {
      Swal.fire({
        title: "Already Applied",
        text: "You have already applied for this job",
        icon: "info",
        confirmButtonText: "OK",
      });
      return;
    }

    const { value: url } = await Swal.fire({
      input: "url",
      inputLabel: "LinkedIn Profile URL",
      inputPlaceholder: "https://www.linkedin.com/in/your-profile",
      inputValidator: (value) => {
        if (!value) {
          return "LinkedIn URL is required!";
        }
        if (!value.includes("linkedin.com")) {
          return "Please enter a valid LinkedIn URL!";
        }
      },
    });

    if (url) {
      setIsApplying(true);
      try {
        const applicationData = {
          jobId: id,
          jobTitle: job.jobTitle,
          applicantName:
            user.displayName || user.email?.split("@")[0] || "Unknown",
          applicantEmail: user.email,
          linkedinUrl: url,
        };

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/apply-job`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(applicationData),
          }
        );

        const result = await response.json();

        if (result.status) {
          setHasApplied(true);
          Swal.fire({
            title: "Success!",
            text: result.message,
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: result.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        console.error("Error applying for job:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to submit application. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setIsApplying(false);
      }
    }
  };

  const handleEdit = () => {
    navigate(`/edit-job/${id}`);
  };

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <PageHeader title={"Job Detail"} path="Job Detail" />
      <h2 className="mt-4">Job ID: {id}</h2>
      <div className="mt-4 mb-4 flex flex-col justify-between items-start gap-4">
        <h1 className="text-blue text-xl font-semibold">Job Detail</h1>
        <p className="text-gray-400 italic w-5/12 text-sm">
          Here's how the job details align with your job preferences. Manage job
          preference in your profile.
        </p>
      </div>
      <h1>{job.jobTitle}</h1>

      <div className="flex flex-col sm:flex-row gap-2 md:gap-4 items-start md:text-md text-sm mt-2">
        <button className="bg-blue px-8 py-2 text-white">
          {job.employmentType}
        </button>

        {/* Show Edit Job button if user is the job owner */}
        {user?.email &&
        job?.postedBy &&
        user.email === job.postedBy &&
        userRole === "recruiter" ? (
          <button
            className="px-8 py-2 text-white bg-orange-600 hover:bg-orange-700 cursor-pointer transition-colors"
            onClick={handleEdit}
          >
            Edit Job
          </button>
        ) : userRole === "recruiter" ? (
          // Show recruiter view for other recruiters
          <button
            className="px-8 py-2 text-gray-500 bg-gray-300 cursor-not-allowed"
            disabled
          >
            Recruiter View
          </button>
        ) : (
          // Show Apply Job button for job seekers
          <button
            className={`px-8 py-2 text-white cursor-pointer transition-colors ${
              hasApplied
                ? "bg-green-600 hover:bg-green-700"
                : "bg-sky-700 hover:bg-sky-800"
            } ${
              hasApplied || isApplying ? "opacity-75 cursor-not-allowed" : ""
            }`}
            onClick={handleApply}
            disabled={hasApplied || isApplying}
          >
            {isApplying ? "Applying..." : hasApplied ? "Applied" : "Apply Now"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        {/* Sidebar - Job Info, Skills, Salary */}
        <div className="lg:col-span-3 order-1 lg:order-1">
          <Sidebar detail={job} />
        </div>

        {/* Main Content - Job Description */}
        <div className="lg:col-span-5 order-3 lg:order-2">
          <Description detail={job} />
        </div>

        {/* Company Details */}
        <div className="lg:col-span-4 order-2 lg:order-3">
          <CompanyDetails job={job} />
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
