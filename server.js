const express = require("express");
const bodyParser = require("body-parser");
const orderRoutes = require("./routes/order");

const app = express();
app.use(bodyParser.json());

app.use("/order", orderRoutes);

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
