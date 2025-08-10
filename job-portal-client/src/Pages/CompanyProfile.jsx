import React, { useState, useEffect } from "react";
import { useAuth } from '../context/useAuth';
import Swal from 'sweetalert2';

const CompanyProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [companyData, setCompanyData] = useState({
    companyName: "",
    companyLogo: "",
    description: "",
    website: "",
    linkedIn: "",
    twitter: "",
    facebook: "",
    companySize: "",
    location: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [isExistingCompany, setIsExistingCompany] = useState(false);

  // Fetch existing company data when component mounts
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!user?.email) return;
      
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/company-profile/${encodeURIComponent(user.email)}`);
        if (response.ok) {
          const data = await response.json();
          setCompanyData(data);
          setIsExistingCompany(true);
        } else if (response.status === 404) {
          // Company profile doesn't exist yet
          setIsExistingCompany(false);
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [user]);

  const handleChange = (e) => {
    setCompanyData({
      ...companyData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.email) {
      Swal.fire('Error', 'You must be logged in to save company profile', 'error');
      return;
    }

    setSaving(true);
    try {
      const dataToSave = {
        ...companyData,
        recruiterEmail: user.email,
        updatedAt: new Date().toISOString()
      };

      // Use POST for new companies, PATCH for updates
      const method = isExistingCompany ? "PATCH" : "POST";
      const response = await fetch("http://localhost:3000/company-profile", {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSave),
      });

      if (response.ok) {
        const result = await response.json();
        if (!isExistingCompany) {
          setIsExistingCompany(true); // Mark as existing after first save
        }
        Swal.fire('Success!', result.message || 'Company profile saved successfully', 'success');
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
        if (response.status === 409 && !isExistingCompany) {
          // Company already exists, switch to update mode
          setIsExistingCompany(true);
          // Retry with PATCH
          const retryResponse = await fetch("http://localhost:3000/company-profile", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSave),
          });
          
          if (retryResponse.ok) {
            const retryResult = await retryResponse.json();
            Swal.fire('Success!', retryResult.message || 'Company profile updated successfully', 'success');
            return;
          }
        }
        throw new Error(errorData.message || 'Failed to save company profile');
      }
    } catch (error) {
      console.error("Error saving company data:", error);
      Swal.fire('Error', error.message || 'Failed to save company profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading company profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Company Profile</h1>
          <p className="text-gray-600">Manage your company information and details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Company Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="companyName"
                value={companyData.companyName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Logo URL *
              </label>
              <input
                type="url"
                name="companyLogo"
                required
                value={companyData.companyLogo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>

          {/* Company Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Description * ({companyData.description.length}/500 characters)
            </label>
            <textarea
              name="description"
              value={companyData.description}
              onChange={handleChange}
              required
              maxLength="500"
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your company, mission, and values..."
            />
          </div>

          {/* Company Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Size
              </label>
              <select
                name="companySize"
                value={companyData.companySize}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select company size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={companyData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="City, State, Country"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email *
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  required
                  value={companyData.contactEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="contact@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  required
                  value={companyData.contactPhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+91 9999999999"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Online Presence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website *
                </label>
                <input
                  type="url"
                  name="website"
                  required
                  value={companyData.website}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://www.company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  name="linkedIn"
                  value={companyData.linkedIn}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter
                </label>
                <input
                  type="url"
                  name="twitter"
                  value={companyData.twitter}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://twitter.com/yourcompany"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook
                </label>
                <input
                  type="url"
                  name="facebook"
                  value={companyData.facebook}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://facebook.com/yourcompany"
                />
              </div>
            </div>
          </div>

          {/* Logo Preview */}
          {companyData.companyLogo && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Logo Preview</h3>
              <div className="flex items-center">
                <img
                  src={companyData.companyLogo}
                  alt="Company Logo"
                  className="h-16 w-16 object-contain border rounded"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <span className="ml-4 text-sm text-gray-600">
                  Make sure your logo URL is accessible and displays correctly
                </span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-blue text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Company Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyProfile;
