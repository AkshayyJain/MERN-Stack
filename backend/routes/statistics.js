const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

router.get("/statistics", async (req, res) => {
  const { month } = req.query;
  const { startDate, endDate } = getMonthStartEndDates(month);

  console.log("Start Date:", startDate);
  console.log("End Date:", endDate);

  try {
    // Fetch the relevant products
    const products = await Product.find({
      dateOfSale: {
        $gte: startDate,
        $lt: endDate,
      },
      sold: true,
    });

    // Convert prices to double and calculate the total sale amount
    const totalSaleAmount = products.reduce((sum, product) => {
      const price = parseFloat(product.price);
      return sum + (isNaN(price) ? 0 : price);
    }, 0);

    console.log("Total Sale Amount:", totalSaleAmount);

    // Count the total sold items
    const totalSoldItems = await Product.countDocuments({
      dateOfSale: {
        $gte: startDate,
        $lt: endDate,
      },
      sold: true,
    });

    console.log("Total Sold Items:", totalSoldItems);

    // Count the total not sold items
    const totalNotSoldItems = await Product.countDocuments({
      dateOfSale: {
        $gte: startDate,
        $lt: endDate,
      },
      sold: false,
    });

    console.log("Total Not Sold Items:", totalNotSoldItems);

    res.status(200).json({
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ message: "Error fetching statistics", error });
  }
});

function getMonthStartEndDates(month) {
  const year = new Date().getFullYear(); // Use current year or adjust as needed
  const monthIndex = new Date(`${month} 1, ${year}`).getMonth();

  const startDate = new Date(year, monthIndex, 1);
  const endDate = new Date(year, monthIndex + 1, 1);

  return { startDate, endDate };
}

module.exports = router;
