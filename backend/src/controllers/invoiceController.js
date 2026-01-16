const path = require("path");
const fs = require("fs-extra");
const { extractText } = require("../services/pdfService");
const { parseInvoice } = require("../utils/parser");
const { createExcel } = require("../services/excelService");

exports.processInvoices = async (req, res) => {
  try {
    const rows = [];

    for (const file of req.files) {
      const text = await extractText(file.path);
      const data = parseInvoice(text);
      rows.push(data);
      await fs.remove(file.path);
    }

    const fileName = `SISL_Invoices_${Date.now()}.xlsx`;
    const filePath = path.join(__dirname, "../../output", fileName);

    await createExcel(rows, filePath);

    res.json({
      status: "completed",
      downloadUrl: `http://localhost:5050/downloads/${fileName}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Processing failed" });
  }
};
