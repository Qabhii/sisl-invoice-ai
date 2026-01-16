const express = require("express");
const cors = require("cors");
const path = require("path");

const invoiceRoutes = require("./routes/invoiceRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/invoices", invoiceRoutes);

// Serve generated Excel files
app.use("/downloads", express.static(path.join(__dirname, "../output")));

module.exports = app;
