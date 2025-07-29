import React from "react";
import InputField from "../Component/InputField";

const EmploymentType = ({ handleChange }) => {
  return (
    <div>
      <h4 className="text-lg font-medium mb-2">Employment Type</h4>
      <div>
        <InputField
          handleChange={handleChange}
          value="full-time"
          title="Full-time"
          name="employmentType"
        />
        <InputField
          handleChange={handleChange}
          value="part-time"
          title="Part-time"
          name="employmentType"
        />
        <InputField
          handleChange={handleChange}
          value="temporary"
          title="Temporary"
          name="employmentType"
        />
      </div>
    </div>
  );
};

export default EmploymentType;
