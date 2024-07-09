const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const initializeRoute = require("./routes/initialize");
const transactionsRoute = require("./routes/transactions");
const statisticsRoute = require("./routes/statistics");
const barChartRoute = require("./routes/barChart");
const pieChartRoute = require("./routes/pieChart");
const combinedRoute = require("./routes/combined");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/mern_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/api", initializeRoute);
app.use("/api", transactionsRoute);
app.use("/api", statisticsRoute);
app.use("/api", barChartRoute);
app.use("/api", pieChartRoute);
app.use("/api", combinedRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
