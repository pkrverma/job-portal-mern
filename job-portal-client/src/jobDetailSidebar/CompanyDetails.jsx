import React from "react";
import {
  FiGlobe,
  FiUsers,
  FiMapPin,
  FiLinkedin,
  FiTwitter,
  FiFacebook,
} from "react-icons/fi";

const CompanyDetails = ({ job }) => {
  const companyProfile = job.companyProfile || {};
  const companyName = companyProfile.companyName || job.companyName;
  const companySize = companyProfile.companySize;
  const companyWebsite = companyProfile.website;
  const companyDescription = companyProfile.description;
  const contactEmail = companyProfile.contactEmail;

  return (
    <div className="w-full bg-[#fafafa] shadow p-4 rounded-lg h-full flex flex-col">
      <div className="flex-grow">
        {companyDescription && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">About the Company</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {companyDescription}
            </p>
          </div>
        )}
        {companySize && (
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <FiUsers className="text-gray-400" size={16} />
            <span className="text-sm">{companySize} employees</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Website and Contact */}
          {(companyWebsite || contactEmail) && (
            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-2">
                Contact Information
              </h4>
              <div className="space-y-2">
                {companyWebsite && (
                  <div className="flex items-center gap-2">
                    <FiGlobe className="text-gray-400" size={16} />
                    <a
                      href={companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {companyWebsite.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
                {contactEmail && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">@</span>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {contactEmail}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Social Links */}
          {(companyProfile.linkedIn ||
            companyProfile.twitter ||
            companyProfile.facebook) && (
            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
              <div className="flex gap-4">
                {companyProfile.linkedIn && (
                  <a
                    href={companyProfile.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
                  >
                    <FiLinkedin size={16} />
                    <span className="text-sm">LinkedIn</span>
                  </a>
                )}
                {companyProfile.twitter && (
                  <a
                    href={companyProfile.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-600 transition"
                  >
                    <FiTwitter size={16} />
                    <span className="text-sm">Twitter</span>
                  </a>
                )}
                {companyProfile.facebook && (
                  <a
                    href={companyProfile.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition"
                  >
                    <FiFacebook size={16} />
                    <span className="text-sm">Facebook</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
