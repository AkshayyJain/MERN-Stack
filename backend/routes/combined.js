const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

router.get("/pie-chart", async (req, res) => {
  const { month } = req.query;
  const monthIndex = new Date(`${month} 1, 2021`).getMonth() + 1;

  try {
    const categories = await Product.aggregate([
      {
        $match: {
          dateOfSale: { $regex: `-${monthIndex.toString().padStart(2, "0")}-` },
        },
      },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.status(200).send(categories);
  } catch (error) {
    res.status(500).send({ message: "Error fetching pie chart data", error });
  }
});

module.exports = router;
