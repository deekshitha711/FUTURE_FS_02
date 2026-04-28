const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/crm")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// simple test route
app.get("/", (req, res) => {
  res.send("Backend working ✅");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

const Lead = require("./models/Lead");

// CREATE
app.post("/leads", async (req, res) => {
  const lead = new Lead(req.body);
  await lead.save();
  res.send(lead);
});

// GET
app.get("/leads", async (req, res) => {
  const leads = await Lead.find();
  res.send(leads);
});

app.put("/leads/:id", async (req, res) => {
  const { status } = req.body;

  try {
    await Lead.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/leads/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await Lead.findByIdAndDelete(id);

    res.json({ message: "Lead deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});