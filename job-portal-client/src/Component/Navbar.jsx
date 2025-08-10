import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router";
import { FaBarsStaggered, FaXmark } from "react-icons/fa6";
import { useAuth } from "../context/useAuth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userRole, loading, signOutUser } = useAuth();
  const menuRef = useRef(null);

  const handleMenuToggler = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Close menu on window resize to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Define navigation items based on user role
  const getNavItems = () => {
    if (userRole === "recruiter") {
      return [
        { path: "/post-job", title: "Post a Job" },
        { path: "/my-job", title: "My Jobs" },
        { path: "/applications", title: "Applications" },
        { path: "/company-profile", title: "Company Profile" },
      ];
    } else if (userRole === "jobseeker") {
      return [
        { path: "/", title: "Start a Search" },
        { path: "/salary", title: "Salary Estimate" },
        { path: "/applied-jobs", title: "Applied Jobs" },
      ];
    } else {
      // For non-logged-in users, only show basic navigation
      return [
        { path: "/", title: "Start a Search" },
        { path: "/salary", title: "Salary Estimate" },
      ];
    }
  };

  const navItems = getNavItems();
  return (
    <header
      className="max-w-screen-2xl container mx-auto xl:px-24 px-4 relative"
      ref={menuRef}
    >
      <nav className="flex justify-between items-center py-6">
        <a href="/" className="flex items-center gap-2 text-2xl text-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="29"
            height="30"
            viewBox="0 0 29 30"
            fill="none"
          >
            <circle
              cx="12.0143"
              cy="12.5143"
              r="12.0143"
              fill="#3575E2"
              fillOpacity="0.4"
            />
            <circle cx="16.9857" cy="17.4857" r="12.0143" fill="#3575E2" />
          </svg>
          <span>JobPortal</span>
        </a>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-12">
          {navItems.map(({ path, title }) => (
            <li key={path} className="text-base text-primary">
              <NavLink
                to={path}
                className={({ isActive, isPending }) =>
                  isActive ? "active" : isPending ? "pending" : ""
                }
              >
                {title}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex text-base text-primary font-medium space-x-5 items-center">
          {!loading && !user && (
            <>
              <Link to="/login" className="py-2 px-5 border rounded">
                Login
              </Link>
              <Link
                to="/sign-up"
                className="py-2 px-5 border rounded bg-blue text-white"
              >
                Sign up
              </Link>
            </>
          )}
          {!loading && user && (
            <div className="flex items-center space-x-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-blue text-white flex items-center justify-center font-semibold">
                  {(user.displayName || user.email || "?")
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}
              <div className="flex flex-col">
                <span
                  className="text-sm font-medium max-w-[140px] truncate"
                  title={user.displayName || user.email}
                >
                  {user.displayName || user.email}
                </span>
                {userRole && (
                  <span className="text-xs text-gray-500 capitalize">
                    {userRole === "jobseeker" ? "Job Seeker" : "Recruiter"}
                  </span>
                )}
              </div>
              <button
                onClick={signOutUser}
                className="py-1 px-3 border rounded text-sm hover:bg-red-700 bg-red-600 text-white transition"
                aria-label="Logout"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex">
          <button
            onClick={handleMenuToggler}
            className="p-3 rounded-md hover:bg-gray-100 transition-colors border border-gray-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <FaXmark className="w-6 h-6 text-gray-700" />
            ) : (
              <FaBarsStaggered className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-gray-900/50  z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute left-4 right-4 top-full mt-2 bg-white shadow-xl border rounded-lg z-50">
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Navigation Links */}
            <ul className="space-y-3">
              {navItems.map(({ path, title }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `block py-3 px-4 rounded-lg text-base font-medium transition-colors ${
                        isActive
                          ? "bg-blue text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    {title}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-gray-200">
              {!loading && !user && (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full py-3 px-4 text-center border border-blue text-blue rounded-lg font-medium hover:bg-blue hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/sign-up"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full py-3 px-4 text-center bg-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              )}

              {!loading && user && (
                <div className="space-y-4">
                  {/* User Info */}
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-blue text-white flex items-center justify-center font-semibold text-lg">
                        {(user.displayName || user.email || "?")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium text-gray-900 truncate"
                        title={user.displayName || user.email}
                      >
                        {user.displayName || user.email}
                      </p>
                      {userRole && (
                        <p className="text-xs text-gray-500 capitalize">
                          {userRole === "jobseeker"
                            ? "Job Seeker"
                            : "Recruiter"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      signOutUser();
                      setIsMenuOpen(false);
                    }}
                    className="w-full py-3 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
