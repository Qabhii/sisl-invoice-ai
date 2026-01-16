const XLSX = require("xlsx");

exports.createExcel = async (rows, filePath) => {
  const finalRows = rows.map((r, i) => {
    const rowNum = i + 2; // Excel rows start at 2

    return {
      "Customer Account Number": r.customer_account_number || "",
      "Invoice Date": r.invoice_date || "",
      "Invoice Number": r.invoice_number || "",
      "STATE CODE": r.state_code || "",
      "GST Number of the Company mentioned in Footer": r.gst_number_footer || "",
      "Service Period": r.service_period || "",

      "Invoice Amount before GST": r.invoice_amount_before_gst || 0,
      "CGST Amount": r.cgst_amount || 0,
      "SGST/UTGST Amount": r.sgst_utgst_amount || 0,
      "Total Taxes": r.total_taxes || 0,

      // Use Excel formulas
      "Total Amount": { f: `G${rowNum}+J${rowNum}` },
      "TDS": { f: `G${rowNum}*0.10` },
      "Net Payable": { f: `K${rowNum}-L${rowNum}` },
    };
  });

  const ws = XLSX.utils.json_to_sheet(finalRows, {
    header: [
      "Customer Account Number",
      "Invoice Date",
      "Invoice Number",
      "STATE CODE",
      "GST Number of the Company mentioned in Footer",
      "Service Period",
      "Invoice Amount before GST",
      "CGST Amount",
      "SGST/UTGST Amount",
      "Total Taxes",
      "Total Amount",
      "TDS",
      "Net Payable",
    ],
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Invoices");
  XLSX.writeFile(wb, filePath);
};
