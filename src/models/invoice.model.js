const mongoose = require("mongoose");

const invoiceModel = new mongoose.Schema(
  {
    client_name: String,
    invoice_id: Number,
    location: {
      details: String,
      area: String,
      city: String,
      province: String,
    },
    making_time: String,
    terms: String,
    discount: Number,
    completed: { type: Boolean, default: false },
    status: { type: String, default: "Pending" },
    items: [
      {
        description: String,
        dimension: String,
        rate: Number,
        quantity: Number,
        price: Number,
        avatar: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const InvoiceModal = mongoose.model("Invoice", invoiceModel);

module.exports = InvoiceModal;
