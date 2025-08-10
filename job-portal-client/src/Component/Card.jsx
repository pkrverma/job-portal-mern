import React from "react";
import { Link } from "react-router";
import { FiCalendar, FiClock, FiDollarSign, FiMapPin } from "react-icons/fi";

const Card = ({ data }) => {
  const {
    _id,
    companyName,
    companyLogo,
    jobTitle,
    jobLocation,
    minPrice,
    maxPrice,
    experienceLevel,
    salaryType,
    employmentType,
    postingDate,
    description,
  } = data;
  return (
    <section className="card">
      <Link
        to={`/job/${_id}`}
        className="flex gap-4 flex-col sm:flex-row items-start"
      >
        <img
          src={companyLogo}
          alt="No Logo found"
          className="h-14 aspect-square"
        />
        <div>
          <h4 className="text-primary mb-1">{companyName}</h4>
          <h3 className="text-lg font-semibold mb-2">{jobTitle}</h3>
          <div className="text-primary/70 text-base flex flex-wrap gap-2 mb-2">
            <span className="flex items-center gap-2 text-sm">
              <FiMapPin /> {jobLocation}
            </span>
            <span className="flex items-center gap-2 text-sm">
              <FiClock /> {employmentType}
            </span>
            <span className="flex items-center gap-2 text-sm">
              <FiDollarSign /> {minPrice} - {maxPrice}
            </span>
            <span className="flex items-center gap-2 text-sm">
              <FiCalendar /> {postingDate}
            </span>
          </div>
          <p className="text-base text-primary/70">{description}</p>
        </div>
      </Link>
    </section>
  );
};

export default Card;
