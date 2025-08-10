const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

//username: pulkit18012003
//password: dwZwp08rYXATbBvL

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@job-portal.4vuwskt.mongodb.net/?retryWrites=true&w=majority&appName=job-portal`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    //create db
    const db = client.db("mernJobPortal");
    const jobCollections = db.collection("demoJobs");
    const applicationCollections = db.collection("jobApplications");
    const userCollections = db.collection("users");
    const companyCollections = db.collection("companies");

    // get all jobs with company details
    app.get("/all-jobs", async (req, res) => {
      const jobs = await jobCollections.find({}).toArray();
      
      // Enrich jobs with company profile data
      const enrichedJobs = await Promise.all(
        jobs.map(async (job) => {
          try {
            const companyProfile = await companyCollections.findOne({ recruiterEmail: job.postedBy });
            if (companyProfile) {
              // Use company profile data if available
              job.companyName = companyProfile.companyName || job.companyName;
              job.companyLogo = companyProfile.companyLogo || job.companyLogo;
              job.companyProfile = companyProfile;
            }
          } catch (error) {
            // If no company profile found, use existing job data
          }
          return job;
        })
      );
      
      res.send(enrichedJobs);
    });

    //get single job using id with company details
    app.get("/all-jobs/:id", async (req, res) => {
      const id = req.params.id;
      const job = await jobCollections.findOne({ _id: new ObjectId(id) });
      
      if (job) {
        // Try to get company details for this job
        try {
          const companyProfile = await companyCollections.findOne({ recruiterEmail: job.postedBy });
          if (companyProfile) {
            job.companyProfile = companyProfile;
          }
        } catch (error) {
          console.log("No company profile found for this job");
        }
      }
      
      res.send(job);
    });

    // get my jobs
    app.get("/myJobs/:email", async (req, res) => {
      // console.log(req.params.email);
      const job = await jobCollections
        .find({ postedBy: req.params.email })
        .toArray();
      res.send(job);
    });

    //delete a job
    app.delete("/job/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const result = await jobCollections.deleteOne(filter);

        if (result.deletedCount === 1) {
          res.status(200).send({
            acknowledged: true,
            deletedCount: 1,
            message: "Job deleted successfully",
          });
        } else {
          res.status(404).send({
            acknowledged: false,
            message: "Job not found",
          });
        }
      } catch (error) {
        console.error("Error deleting job:", error);
        res.status(500).send({
          acknowledged: false,
          message: "Internal server error",
          error: error.message,
        });
      }
    });

    //update a job
    app.patch("/update-job/:id", async (req, res) => {
      const id = req.params.id;
      const jobData = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          ...jobData,
        },
      };
      const result = await jobCollections.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    //post a job
    app.post("/post-job", async (req, res) => {
      const body = req.body;
      body.createAt = new Date();
      // console.log(body);
      const result = await jobCollections.insertOne(body);
      if (result.insertedId) {
        return res.status(200).send(result);
      } else {
        return res.status(404).send({
          message: "Failed to post job",
          status: false,
        });
      }
    });

    //register user
    app.post("/register-user", async (req, res) => {
      try {
        const userData = req.body;
        
        // Check if user already exists
        const existingUser = await userCollections.findOne({ 
          $or: [
            { email: userData.email },
            { uid: userData.uid }
          ]
        });
        
        if (existingUser) {
          // Update existing user's role if needed
          const result = await userCollections.updateOne(
            { $or: [{ email: userData.email }, { uid: userData.uid }] },
            { $set: { role: userData.role, name: userData.name } }
          );
          return res.status(200).send({ message: "User updated successfully", result });
        } else {
          // Create new user
          const result = await userCollections.insertOne(userData);
          return res.status(201).send({ message: "User registered successfully", result });
        }
      } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).send({ message: "Failed to register user", error: error.message });
      }
    });

    //apply for a job
    app.post("/apply-job", async (req, res) => {
      try {
        const { jobId, jobTitle, applicantName, applicantEmail, linkedinUrl } = req.body;
        
        // Check if user already applied for this job
        const existingApplication = await applicationCollections.findOne({
          jobId: jobId,
          applicantEmail: applicantEmail
        });
        
        if (existingApplication) {
          return res.status(400).send({
            message: "You have already applied for this job",
            status: false
          });
        }
        
        const applicationData = {
          jobId,
          jobTitle,
          applicantName,
          applicantEmail,
          linkedinUrl,
          appliedAt: new Date(),
          status: "pending"
        };
        
        const result = await applicationCollections.insertOne(applicationData);
        
        if (result.insertedId) {
          return res.status(200).send({
            message: "Application submitted successfully",
            status: true,
            applicationId: result.insertedId
          });
        } else {
          return res.status(500).send({
            message: "Failed to submit application",
            status: false,
          });
        }
      } catch (error) {
        console.error("Error submitting application:", error);
        return res.status(500).send({
          message: "Internal server error",
          status: false,
          error: error.message
        });
      }
    });

    //check if user has already applied for a job
    app.get("/check-application/:jobId/:email", async (req, res) => {
      try {
        const { jobId, email } = req.params;
        
        const existingApplication = await applicationCollections.findOne({
          jobId: jobId,
          applicantEmail: decodeURIComponent(email)
        });
        
        res.status(200).send({
          hasApplied: !!existingApplication
        });
      } catch (error) {
        console.error("Error checking application:", error);
        res.status(500).send({
          hasApplied: false,
          error: error.message
        });
      }
    });

    //get user by email
    app.get("/user/:email", async (req, res) => {
      try {
        const email = decodeURIComponent(req.params.email);
        const user = await userCollections.findOne({ email: email });
        
        if (user) {
          res.status(200).send(user);
        } else {
          res.status(404).send({ message: "User not found" });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send({ message: "Internal server error", error: error.message });
      }
    });

    //get user by UID
    app.get("/user-by-uid/:uid", async (req, res) => {
      try {
        const uid = req.params.uid;
        const user = await userCollections.findOne({ uid: uid });
        
        if (user) {
          res.status(200).send(user);
        } else {
          res.status(404).send({ message: "User not found" });
        }
      } catch (error) {
        console.error("Error fetching user by UID:", error);
        res.status(500).send({ message: "Internal server error", error: error.message });
      }
    });

    //save or update company profile
    app.post("/company-profile", async (req, res) => {
      try {
        const companyData = req.body;
        
        // Check if company profile already exists for this recruiter
        const existingCompany = await companyCollections.findOne({ 
          recruiterEmail: companyData.recruiterEmail 
        });
        
        if (existingCompany) {
          return res.status(409).send({ message: "Company profile already exists. Use PATCH to update." });
        }
        
        // Remove _id field if present (shouldn't be in new data, but just in case)
        const { _id, ...newCompanyData } = companyData;
        
        // Create new company profile
        newCompanyData.createdAt = new Date().toISOString();
        const result = await companyCollections.insertOne(newCompanyData);
        return res.status(201).send({ message: "Company profile created successfully", result });
      } catch (error) {
        console.error("Error creating company profile:", error);
        return res.status(500).send({ message: "Failed to create company profile", error: error.message });
      }
    });

    //update existing company profile
    app.patch("/company-profile", async (req, res) => {
      try {
        const companyData = req.body;
        
        // Check if company profile exists for this recruiter
        const existingCompany = await companyCollections.findOne({ 
          recruiterEmail: companyData.recruiterEmail 
        });
        
        if (!existingCompany) {
          return res.status(404).send({ message: "Company profile not found" });
        }
        
        // Remove _id field from update data to avoid immutable field error
        const { _id, ...updateData } = companyData;
        
        // Update existing company profile
        const result = await companyCollections.updateOne(
          { recruiterEmail: companyData.recruiterEmail },
          { $set: updateData }
        );
        
        return res.status(200).send({ message: "Company profile updated successfully", result });
      } catch (error) {
        console.error("Error updating company profile:", error);
        return res.status(500).send({ message: "Failed to update company profile", error: error.message });
      }
    });

    //get company profile by recruiter email
    app.get("/company-profile/:email", async (req, res) => {
      try {
        const recruiterEmail = decodeURIComponent(req.params.email);
        const company = await companyCollections.findOne({ recruiterEmail: recruiterEmail });
        
        if (company) {
          res.status(200).send(company);
        } else {
          res.status(404).send({ message: "Company profile not found" });
        }
      } catch (error) {
        console.error("Error fetching company profile:", error);
        res.status(500).send({ message: "Internal server error", error: error.message });
      }
    });

    //get applied jobs by user email
    app.get("/applied-jobs/:email", async (req, res) => {
      try {
        const userEmail = decodeURIComponent(req.params.email);
        
        // Get all applications by this user
        const applications = await applicationCollections.find({ applicantEmail: userEmail }).toArray();
        
        if (applications.length === 0) {
          return res.send([]);
        }
        
        // Get job details for each application
        const enrichedApplications = await Promise.all(
          applications.map(async (application) => {
            try {
              const jobDetails = await jobCollections.findOne({ _id: new ObjectId(application.jobId) });
              return {
                ...application,
                jobDetails: jobDetails || null
              };
            } catch (error) {
              return {
                ...application,
                jobDetails: null
              };
            }
          })
        );
        
        res.send(enrichedApplications);
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
        res.status(500).send({ message: "Internal server error", error: error.message });
      }
    });

    //withdraw job application
    app.delete("/withdraw-application", async (req, res) => {
      try {
        const { jobId, applicantEmail } = req.body;
        
        const result = await applicationCollections.deleteOne({
          jobId: jobId,
          applicantEmail: applicantEmail
        });
        
        if (result.deletedCount === 1) {
          res.status(200).send({ message: "Application withdrawn successfully" });
        } else {
          res.status(404).send({ message: "Application not found" });
        }
      } catch (error) {
        console.error("Error withdrawing application:", error);
        res.status(500).send({ message: "Internal server error", error: error.message });
      }
    });

    //get applications for recruiter's jobs
    app.get("/applications/:email", async (req, res) => {
      try {
        const recruiterEmail = decodeURIComponent(req.params.email);
        
        // Get all jobs posted by this recruiter
        const recruiterJobs = await jobCollections.find({ postedBy: recruiterEmail }).toArray();
        const jobIds = recruiterJobs.map(job => job._id.toString());
        
        if (jobIds.length === 0) {
          return res.send([]);
        }
        
        // Get all applications for these jobs
        const applications = await applicationCollections.find({ 
          jobId: { $in: jobIds } 
        }).toArray();
        
        // Enrich applications with job details
        const enrichedApplications = applications.map(application => {
          const jobDetails = recruiterJobs.find(job => job._id.toString() === application.jobId);
          return {
            ...application,
            jobDetails: jobDetails ? {
              companyName: jobDetails.companyName,
              minPrice: jobDetails.minPrice,
              maxPrice: jobDetails.maxPrice,
              salaryType: jobDetails.salaryType,
              jobLocation: jobDetails.jobLocation
            } : null
          };
        });
        
        res.send(enrichedApplications);
      } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).send({
          message: "Internal server error",
          error: error.message
        });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to the Job Portal Server!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
