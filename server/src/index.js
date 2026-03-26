require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDb = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth");
const dealerRoutes = require("./routes/dealers");
const leadRoutes = require("./routes/leads");
const orderRoutes = require("./routes/orders");
const paymentRoutes = require("./routes/payments");
const schemeRoutes = require("./routes/schemes");
const ticketRoutes = require("./routes/tickets");
const salesRoutes = require("./routes/sales");
const dashboardRoutes = require("./routes/dashboard");
const userRoutes = require("./routes/users");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString() }));
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/dealers", dealerRoutes);
app.use("/leads", leadRoutes);
app.use("/orders", orderRoutes);
app.use("/payments", paymentRoutes);
app.use("/schemes", schemeRoutes);
app.use("/tickets", ticketRoutes);
app.use("/sales", salesRoutes);
app.use("/dashboard", dashboardRoutes);

app.use(errorHandler);

const port = process.env.PORT || 4000;
if (process.env.NODE_ENV !== "test") {
  connectDb(process.env.MONGO_URI).then(() => {
    app.listen(port, () => console.log(`API listening on ${port}`));
  });
}

module.exports = app;