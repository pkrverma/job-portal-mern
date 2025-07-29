import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Creatable from "react-select/creatable";

const CreateJob = () => {
  const {
    register,
    handleSubmit, reset,
    formState: { errors },
  } = useForm();

  const [selectedOption, setSetselectedOption] = useState(null);

  const onSubmit = (data) => {
    data.skills = selectedOption;
    // console.log(data);
    fetch("http://localhost:3000/post-job", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result.acknowledged === true) {
          alert("Job posted successfully!");
        }
        reset();
      });
  };

  const options = [
    {
      value: "Java",
      label: "Java",
    },
    {
      value: "JavaScript",
      label: "JavaScript",
    },
    {
      value: "Python",
      label: "Python",
    },
    {
      value: "React",
      label: "React",
    },
    {
      value: "Node.js",
      label: "Node.js",
    },
    {
      value: "CSS",
      label: "CSS",
    },
    {
      value: "HTML",
      label: "HTML",
    },
    {
      value: "SQL",
      label: "SQL",
    },
    {
      value: "C++",
      label: "C++",
    },
    {
      value: "Ruby",
      label: "Ruby",
    },
    {
      value: "PHP",
      label: "PHP",
    },
    {
      value: "Swift",
      label: "Swift",
    },
  ];
  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <div className="bg-[#fafafa] py-10 px-4 lg:px-16">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="create-job-flex ">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Job Title</label>
              <input
                className="create-job-input"
                type="text"
                defaultValue={"Web Developer"}
                {...register("jobTitle")}
              />
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Company Name</label>
              <input
                className="create-job-input"
                type="text"
                placeholder="Ex: Microsoft"
                {...register("companyName")}
              />
            </div>
          </div>
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Minimum Salary</label>
              <input
                className="create-job-input"
                type="text"
                placeholder="₹ 20k"
                {...register("minPrice")}
              />
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Maximum Salary</label>
              <input
                className="create-job-input"
                type="text"
                placeholder="₹ 130k"
                {...register("maxPrice")}
              />
            </div>
          </div>
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Salary Type</label>
              <select {...register("salaryType")} className="create-job-input">
                <option value="">Choose your salary</option>
                <option value="Hourly">Hourly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Job Location</label>
              <input
                className="create-job-input"
                type="text"
                placeholder="Ex: Gurugram"
                {...register("jobLocation")}
              />
            </div>
          </div>
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Job Posting Date</label>
              <input
                className="create-job-input"
                type="date"
                placeholder="Ex: 15-07-2025"
                {...register("postingDate")}
              />
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Experience Level</label>
              <select
                {...register("experienceLevel")}
                className="create-job-input"
              >
                <option value="">Select your experience level</option>
                <option value="NoExperience">No experience</option>
                <option value="Internship">Internship</option>
                <option value="Work remotely">Work remotely</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block mb-2 text-lg">Required Skill Sets:</label>
            <Creatable
              default={selectedOption}
              onChange={setSetselectedOption}
              options={options}
              isMulti
              className="create-job-input pr-2"
            />
          </div>
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Company Logo</label>
              <input
                className="create-job-input"
                type="url"
                placeholder="Paste your company logo URL"
                {...register("companyLogo")}
              />
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Employment Type</label>
              <select
                {...register("employmentType")}
                className="create-job-input"
              >
                <option value="">Select your employment type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Temporary">Temporary</option>
              </select>
            </div>
          </div>
          <div className="w-full">
            <label className="block mb-2 text-lg">Job Description</label>
            <textarea
              className="w-full pl-3 py-1.5 focus:outline-none placeholder:text-gray-600 bg-white"
              rows={6}
              placeholder="Job Description"
              defaultValue={
                "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem, eveniet."
              }
              {...register("description")}
            />
          </div>

          <div>
            <label className="block mb-2 text-lg">Job Posted By</label>
            <input
              className="w-full create-job-input"
              type="email"
              placeholder="Your email"
              {...register("postedBy")}
            />
          </div>
          <input
            type="submit"
            className="block mt-12 bg-blue text-white font-semibold px-8 py-2 rounded-sm cursor-pointer"
          />
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
