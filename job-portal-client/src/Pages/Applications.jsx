import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/useAuth";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();

  const fetchApplications = async (email) => {
    if (!email) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/applications/${encodeURIComponent(
          email
        )}`
      );
      const data = await response.json();
      setApplications(data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchApplications(user.email);
    } else if (!authLoading) {
      setApplications([]);
    }
  }, [user?.email, authLoading]);

  if (authLoading) {
    return (
      <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 py-12">
        Loading applications...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 py-12 text-center space-y-4">
        <h2 className="text-xl font-semibold">
          Please log in to view job applications.
        </h2>
        <Link
          to="/login"
          className="bg-blue text-white px-6 py-2 rounded inline-block"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <div className="my-jobs-container">
        <h1 className="text-center text-2xl font-semibold mb-6">
          Job Applications
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Applications received for your posted jobs
        </p>
      </div>

      <section className="py-1 Gray-50">
        <div className="w-full mb-4 px-4 mx-auto mt-5">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                  <h3 className="font-semibold text-base text-blueGray-700">
                    All Applications
                  </h3>
                </div>
              </div>
            </div>

            <div className="block w-full overflow-x-auto">
              <table className="items-center bg-transparent w-full border-collapse">
                <thead>
                  <tr>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Applicant
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Job Title
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Salary Range
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Applied Date
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      LinkedIn
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Job Details
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Action
                    </th>
                  </tr>
                </thead>

                {isLoading ? (
                  <tbody>
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-6 text-sm text-gray-500"
                      >
                        Loading applications...
                      </td>
                    </tr>
                  </tbody>
                ) : applications.length === 0 ? (
                  <tbody>
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-10 text-sm text-gray-500"
                      >
                        No applications received yet
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    {applications.map((application, index) => (
                      <tr key={application._id || index}>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">
                              {application.applicantName}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {application.applicantEmail}
                            </span>
                          </div>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          <span className="font-medium">
                            {application.jobTitle}
                          </span>
                          <div className="text-gray-500 text-xs">
                            ID: {application.jobId}
                          </div>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          {application.jobDetails
                            ? `₹ ${application.jobDetails.minPrice}k - ${application.jobDetails.maxPrice}k`
                            : "N/A"}
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          {new Date(application.appliedAt).toLocaleDateString()}
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          <a
                            href={application.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Profile
                          </a>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          <Link
                            to={`/job/${application.jobId}`}
                            className="bg-blue-600 text-white py-1 px-3 rounded text-xs hover:bg-blue-700 transition"
                          >
                            View Job
                          </Link>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          {application.status === "selected" ? (
                            <>
                              <span className="text-green-600 font-semibold">Selected</span>
                              {application.offerLetterUrl ? (
                                <span className="block text-blue-600 text-xs mt-1">Offer Letter Added</span>
                              ) : null}
                            </>
                          ) : application.status === "rejected" ? (
                            <span className="text-red-600 font-semibold">Rejected</span>
                          ) : (
                            <>
                              <button
                                title="Select"
                                className="text-green-600 hover:text-green-800 mr-2 text-xs font-semibold border border-green-600 rounded px-2 py-1"
                                onClick={async () => {
                                  const { value: offerLetterUrl } = await window.Swal.fire({
                                    title: 'Enter Offer Letter Link',
                                    input: 'url',
                                    inputLabel: 'Google Drive/Dropbox/Other link to offer letter',
                                    inputPlaceholder: 'Paste offer letter link here',
                                    showCancelButton: true,
                                    confirmButtonText: 'Submit',
                                    cancelButtonText: 'Cancel',
                                    inputValidator: (value) => {
                                      if (!value) {
                                        return 'You need to provide a link!';
                                      }
                                    }
                                  });
                                  if (offerLetterUrl) {
                                    const appId = application._id;
                                    const body = { status: "selected", offerLetterUrl };
                                    console.log("PATCH application-status", appId, body);
                                    const response = await fetch(`${import.meta.env.VITE_API_URL}/application-status/${appId}`, {
                                      method: "PATCH",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify(body)
                                    });
                                    const result = await response.json();
                                    window.Swal.fire('Offer Letter Added!', 'The offer letter link has been saved and will be visible to the job seeker.', 'success');
                                    // Refetch applications from backend
                                    fetchApplications(user.email);
                                  }
                                }}
                                disabled={application.status === "selected" || application.status === "rejected"}
                              >
                                Select
                              </button>
                              <button
                                title="Reject"
                                className="text-red-600 hover:text-red-800 text-xs font-semibold border border-red-600 rounded px-2 py-1"
                                onClick={async () => {
                                  const appId = application._id;
                                  const body = { status: "rejected" };
                                  console.log("PATCH application-status", appId, body);
                                  const response = await fetch(`${import.meta.env.VITE_API_URL}/application-status/${appId}`, {
                                    method: "PATCH",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify(body)
                                  });
                                  const result = await response.json();
                                  console.log("Server response:", result);
                                  // Refetch applications from backend
                                  fetchApplications(user.email);
                                }}
                                disabled={application.status === "selected" || application.status === "rejected"}
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Applications;
