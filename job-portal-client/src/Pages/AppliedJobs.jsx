import React, { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { Link } from "react-router";
import {
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiMapPin,
  FiTrash2,
} from "react-icons/fi";
import Swal from "sweetalert2";

const AppliedJobs = () => {
  const { user } = useAuth();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(null);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/applied-jobs/${encodeURIComponent(
            user.email
          )}`
        );
        if (response.ok) {
          const data = await response.json();
          setAppliedJobs(data);
        } else {
          console.error("Failed to fetch applied jobs");
        }
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [user]);

  const handleWithdrawApplication = async (jobId, jobTitle) => {
    const result = await Swal.fire({
      title: "Withdraw Application?",
      text: `Are you sure you want to withdraw your application for "${jobTitle}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, withdraw it!",
    });

    if (result.isConfirmed) {
      setWithdrawing(jobId);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/withdraw-application`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              jobId: jobId,
              applicantEmail: user.email,
            }),
          }
        );

        if (response.ok) {
          // Remove the job from the list
          setAppliedJobs(appliedJobs.filter((job) => job.jobId !== jobId));
          Swal.fire(
            "Withdrawn!",
            "Your application has been withdrawn.",
            "success"
          );
        } else {
          throw new Error("Failed to withdraw application");
        }
      } catch (error) {
        console.error("Error withdrawing application:", error);
        Swal.fire(
          "Error",
          "Failed to withdraw application. Please try again.",
          "error"
        );
      } finally {
        setWithdrawing(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading your applied jobs...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please log in to view your applied jobs
          </h1>
          <Link to="/login" className="bg-blue text-white px-6 py-2 rounded">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Applied Jobs</h1>
        <p className="text-gray-600">Track all the jobs you've applied for</p>
      </div>

      {appliedJobs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            You haven't applied for any jobs yet
          </div>
          <Link
            to="/"
            className="inline-block bg-blue text-white px-6 py-3 rounded-md hover:bg-blue-600 transition"
          >
            Start Job Search
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {appliedJobs.map((application) => (
            <div
              key={application._id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    {application.jobDetails?.companyLogo && (
                      <img
                        src={application.jobDetails.companyLogo}
                        alt="Company Logo"
                        className="h-12 w-12 object-cover rounded border"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {application.jobDetails?.jobTitle ||
                            "Job Title Not Available"}
                        </h3>
                        {application.status === "selected" ? (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">Selected</span>
                        ) : application.status === "rejected" ? (
                          <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded">Rejected</span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">Pending</span>
                        )}
                      </div>

                      <h4 className="text-lg text-blue-600 mb-3">
                        {application.jobDetails?.companyName ||
                          "Company Name Not Available"}
                      </h4>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        {application.jobDetails?.jobLocation && (
                          <span className="flex items-center gap-1">
                            <FiMapPin className="text-gray-400" />
                            {application.jobDetails.jobLocation}
                          </span>
                        )}
                        {application.jobDetails?.employmentType && (
                          <span className="flex items-center gap-1">
                            <FiClock className="text-gray-400" />
                            {application.jobDetails.employmentType}
                          </span>
                        )}
                        {(application.jobDetails?.minPrice ||
                          application.jobDetails?.maxPrice) && (
                          <span className="flex items-center gap-1">
                            <FiDollarSign className="text-gray-400" />
                            {application.jobDetails.minPrice &&
                            application.jobDetails.maxPrice
                              ? `${application.jobDetails.minPrice}k - ${application.jobDetails.maxPrice}k`
                              : application.jobDetails.minPrice ||
                                application.jobDetails.maxPrice}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FiCalendar className="text-gray-400" />
                          Applied on:{" "}
                          {new Date(application.appliedAt).toLocaleDateString()}
                        </span>
                        {application.linkedinProfile && (
                          <a
                            href={application.linkedinProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View LinkedIn Profile
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Link
                    to={`/job/${application.jobId}`}
                    className="bg-blue text-white px-4 py-2 rounded text-sm hover:bg-blue-600 transition"
                  >
                    View Job
                  </Link>
                  {application.status === "selected" ? (
                    <a
                      href={application.offerLetterUrl || undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`bg-green-600 text-white px-4 py-2 rounded text-sm font-semibold border border-green-700 transition ${application.offerLetterUrl ? "hover:bg-green-700" : "opacity-50 cursor-not-allowed"}`}
                      disabled={!application.offerLetterUrl}
                      onClick={e => {
                        if (!application.offerLetterUrl) {
                          e.preventDefault();
                        }
                      }}
                    >
                      Get Offer Letter
                    </a>
                  ) : (
                    <button
                      onClick={() =>
                        handleWithdrawApplication(
                          application.jobId,
                          application.jobDetails?.jobTitle
                        )
                      }
                      disabled={withdrawing === application.jobId}
                      className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600 transition disabled:opacity-50 flex items-center gap-1"
                    >
                      <FiTrash2 size={14} />
                      {withdrawing === application.jobId
                        ? "Withdrawing..."
                        : "Withdraw"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;
