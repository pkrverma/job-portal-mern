import React from "react";
import { FiMapPin } from "react-icons/fi";

const Sidebar = (props) => {
  const detail = props.detail || {};
  const rawSkillList = detail.skills;
  const isLoading = rawSkillList === undefined;
  const skillList = Array.isArray(rawSkillList) ? rawSkillList : [];

  // Salary data
  const { minPrice, maxPrice, salaryType } = detail;

  const salaryLoading = minPrice === undefined && maxPrice === undefined;

  const formatMoney = (val) => {
    if (val == null) return null;
    // If already a string like '190k'
    if (typeof val === "string") return val.trim();
    if (typeof val === "number") {
      if (val >= 1000) {
        const thousands = (val / 1000).toFixed(val % 1000 === 0 ? 0 : 1);
        return `${thousands}k`;
      }
      return val.toString();
    }
    return String(val);
  };

  const salaryText = (() => {
    const minF = formatMoney(minPrice);
    const maxF = formatMoney(maxPrice);
    if (!minF && !maxF) return null;
    if (minF && maxF) return `${minF} - ${maxF}`;
    return minF || maxF;
  })();

  const renderSkillText = (item) => {
    if (typeof item === "string") return item;
    if (item == null) return "Unknown";
    return item.value;
  };

  return (
    <>
      <div className="w-full bg-[#fafafa] shadow p-4 rounded-lg h-full flex flex-col">
        {/* Company Info Section - Top: logo, name, company location */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-start gap-4">
            {detail.companyLogo && (
              <img
                src={detail.companyLogo}
                alt={`${detail.companyName || 'Company'} logo`}
                className="h-12 w-12 object-cover rounded border flex-shrink-0"
                loading="lazy"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                {detail.companyName || "Company Name Not Available"}
              </h3>
              {detail.companyProfile?.location && (
                <div className="flex items-center gap-2 text-gray-600">
                  <FiMapPin className="text-gray-400 flex-shrink-0" size={14} />
                  <span className="text-sm truncate">{detail.companyProfile.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Job Info */}
        <div className="mb-4 flex-grow">
          <h2 className="text-lg font-semibold mb-2">Job Info</h2>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Experience: </span>
            {detail.experienceLevel || "N/A"}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Posted on: </span>
            {(() => {
              const dateStr = detail.postingDate || detail.createAt;
              if (!dateStr) return "N/A";
              const d = new Date(dateStr);
              return isNaN(d) ? dateStr : d.toLocaleDateString();
            })()}
          </p>
          {detail.jobLocation && (
            <div className="flex items-center gap-2 text-gray-600 mt-2">
              <FiMapPin className="text-gray-400 flex-shrink-0" size={14} />
              <span className="text-sm truncate">{detail.jobLocation}</span>
            </div>
          )}
        </div>

        <div className="mb-4 flex-grow">
          <h2 className="text-lg font-semibold mb-2">Skills</h2>
          <ul className="list-disc space-y-1 wrap w-fit flex flex-row flex-wrap">
            {isLoading && (
              <li className="text-sm text-gray-500 animate-pulse">
                Loading skills...
              </li>
            )}
            {!isLoading && skillList.length === 0 && (
              <li className="text-sm text-gray-500">No skills.</li>
            )}
            {!isLoading &&
              skillList.length > 0 &&
              skillList.map((s, idx) => (
                <span
                  key={idx}
                  className="text-sm text-gray-700 bg-white py-2 px-3 w-fit mx-2 my-1"
                >
                  {renderSkillText(s)}
                </span>
              ))}
          </ul>
        </div>

        <div className="mb-4 flex-grow">
          <h2 className="text-lg font-semibold mb-2">Salary</h2>
          {salaryLoading && (
            <p className="text-sm text-gray-500 animate-pulse">
              Loading salary...
            </p>
          )}
          {!salaryLoading && (
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-medium">Salary Range: </span>
                {salaryText ? salaryText : "Not set"}
              </p>
              <p>
                <span className="font-medium">Salary Type: </span>
                {salaryType || "Not set"}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
