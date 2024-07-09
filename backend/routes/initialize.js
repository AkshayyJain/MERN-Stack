const express = require("express");
const axios = require("axios");
const Product = require("../models/Product");

const router = express.Router();

router.post("/initialize", async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const data = response.data;

    // Clear existing data
    await Product.deleteMany({});

    // Seed new data
    await Product.insertMany(data);

    res.status(200).send({ message: "Database initialized successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error initializing database", error });
  }
});

module.exports = router;
