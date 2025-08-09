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

    // get all jobs
    app.get("/all-jobs", async (req, res) => {
      const jobs = await jobCollections.find({}).toArray();
      res.send(jobs);
    });

    //get single job using id
    app.get("/all-jobs/:id", async (req, res) => {
      const id = req.params.id;
      const job = await jobCollections.findOne({ _id: new ObjectId(id) });
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
