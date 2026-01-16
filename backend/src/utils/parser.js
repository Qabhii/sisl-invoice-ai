function pickNumberFromSummary(text, label) {
  const r = new RegExp(label + "\\s*\\(?₹?\\)?\\s*([\\d,]+\\.\\d{2})", "i");
  const m = text.match(r);
  return m ? Number(m[1].replace(/,/g, "")) : 0;
}

function pickTextLine(text, label) {
  const r = new RegExp(label + "\\s*:?\\s*([^\\n]+)", "i");
  const m = text.match(r);
  return m ? m[1].trim() : "";
}

// Footer: STATE: Delhi, STATE CODE: 07, GST Number: 07AAACB2894G1ZP
function pickFooterGST(text) {
  const r = /STATE\s*:\s*[A-Za-z ]+,\s*STATE CODE\s*:\s*(\d{2}),\s*GST Number\s*:\s*([0-9A-Z]+)/i;
  const m = text.match(r);
  if (!m) return { stateCode: "", gst: "" };
  return { stateCode: m[1], gst: m[2] };
}

// Service Period block: 01-Oct-2025 to 31-Dec-2025
function pickServicePeriod(text) {
  const r =
    /Installation\s*Date\s*\/\s*Service\s*Period[\s\S]*?(\d{2}-[A-Za-z]{3}-\d{4})[\s\r\n]*to[\s\r\n]*(\d{2}-[A-Za-z]{3}-\d{4})/i;

  const m = text.match(r);
  if (!m) return "";

  return `${m[1]} to ${m[2]}`;
}


exports.parseInvoice = (text) => {
  const taxable = pickNumberFromSummary(text, "Sub-Total");
  const cgst = pickNumberFromSummary(text, "CGST");
  const sgst = pickNumberFromSummary(text, "SGST/UTGST");
  const totalTaxes = pickNumberFromSummary(text, "Total Taxes");
  const totalAmount = pickNumberFromSummary(text, "Total \\(₹\\)|Total");

  const tds = +(taxable * 0.10).toFixed(2);
  const netPayable = +(totalAmount - tds).toFixed(2);

  const footer = pickFooterGST(text);

  return {
    customer_account_number: pickTextLine(text, "Customer Account Number"),
    invoice_date: pickTextLine(text, "Invoice Date"),
    invoice_number: pickTextLine(text, "Invoice Number"),

    state_code: footer.stateCode,
    gst_number_footer: footer.gst,
    service_period: pickServicePeriod(text),

    invoice_amount_before_gst: taxable,
    cgst_amount: cgst,
    sgst_utgst_amount: sgst,
    total_taxes: totalTaxes,
    total_amount: totalAmount,

    tds,
    net_payable: netPayable,
  };
};
