const express = require("express");
const multer = require("multer");
const { processInvoices } = require("../controllers/invoiceController");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/process", upload.array("pdfs", 1000), processInvoices);

module.exports = router;
