const mongoose = require("mongoose");

const invoiceModel = new mongoose.Schema(
  {
    client_name: String,
    location: {
      details: String,
      area: String,
      city: String,
      province: String,
      country: String,
    },
    estimate_time: String,
    terms: String,
    discount: Number,
    items: [
      {
        description: String,
        dimensions: String,
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

const Invoice = mongoose.model("Invoice", invoiceModel);

module.exports = Invoice;
