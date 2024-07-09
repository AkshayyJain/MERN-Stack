// seed.js
const mongoose = require("mongoose");
const axios = require("axios");

// Define MongoDB schema
const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
  sold: Boolean,
  dateOfSale: Date,
});

const Product = mongoose.model("Product", productSchema);

const mongoURI = "mongodb://localhost:27017/mern_db";

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Fetch data from the third-party API
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const products = response.data;

    // Clear existing data
    await Product.deleteMany({});
    console.log("Cleared existing data");

    // Insert new data
    await Product.insertMany(products);
    console.log("Inserted new data");

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

// Run the seeding function
seedDatabase();
