const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

router.get("/transactions", async (req, res) => {
  const { month, page = 1, perPage = 10, search = "" } = req.query;

  const monthIndex = new Date(`${month} 1, 2021`).getMonth() + 1;
  const regex = new RegExp(search, "i");

  try {
    const query = {
      $expr: {
        $eq: [{ $month: "$dateOfSale" }, monthIndex],
      },
      $or: [
        { title: { $regex: regex } },
        { description: { $regex: regex } },
        
      ],
    };

    const transactions = await Product.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage))
      .exec();

    res.status(200).send(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).send({ message: "Error fetching transactions", error });
  }
});

module.exports = router;
