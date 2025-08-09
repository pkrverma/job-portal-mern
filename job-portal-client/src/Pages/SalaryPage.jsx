import React, { useEffect, useState } from "react";
import PageHeader from "../Component/PageHeader";

const SalaryPage = () => {
  const [searchText, setsearchText] = useState("");
  const [salary, setSalary] = useState([]);
  console.log(searchText);

  useEffect(() => {
    fetch("salary.json")
      .then((res) => res.json())
      .then((data) => setSalary(data));
  }, [searchText]);

  const handleSearch = () => {
    const filter = salary.filter(
      (job) => job.title.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
    );
    console.log(filter);
    setSalary(filter);
  };

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-40 px-4">
      <PageHeader title={"Estimated Salary"} path={"Salary"} />
      <div className="mt-5">
        <div className="search-box p-2 text-center mb-2">
          <input
            type="text"
            name="search"
            onChange={(e) => setsearchText(e.target.value)}
            className="py-2 pl-3 border focus:outline-none lg:w-6/12 mb-4 w-full"
          />
          <button
            onClick={handleSearch}
            className="bg-blue text-white font-semibold px-8 py-2 rounded-sm mb-4"
          >
            Search
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-col-1 gap-12 my-12 items-center ">
        {salary.map((data) => (
          <div key={data.id} className="shadow px-4 py-8">
            <h4 className="font-semibold text-xl">{data.title}</h4>
            <p className="my-2 font-medium text-blue text-lg">{data.salary}</p>
            <div className="flex flex-wrap gap-4">
              <a href="/" className="underline">
                {data.status}
              </a>
              <a href="/" className="underline">
                {data.skills}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalaryPage;
