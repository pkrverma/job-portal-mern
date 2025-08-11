import React from "react";
import InputField from "../Component/InputField";

const WorkExperience = ({ handleChange }) => {
  return (
    <div>
      <h4 className="text-lg font-medium mb-2">Work Experience</h4>
      <div>
        <InputField
          handleChange={handleChange}
          value="Any experience"
          title=""
          name="test4"
        />
        <InputField
          handleChange={handleChange}
          value="Internship"
          title="Internship"
          name="test4"
        />
        <InputField
          handleChange={handleChange}
          value="Work remotely"
          title="Work remotely"
          name="test4"
        />
      </div>
    </div>
  );
};

export default WorkExperience;
