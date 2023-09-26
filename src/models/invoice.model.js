const mongoose = require("mongoose");
const counterSchema = new mongoose.Schema({
  name: String,
  lastUsedId: Number,
});

const Counter = mongoose.model("Counter", counterSchema);
const invoiceModel = new mongoose.Schema(
  {
    client_name: String,
    invoice_id: { type: String, unique: true },
    location: {
      details: String,
      area: String,
      city: String,
      province: String,
    },
    category: String,
    making_time: String,
    terms: String,
    payment: String,
    price: Number,
    discount: Number,
    completed: { type: Boolean, default: false },
    currentStatus: { type: String, default: "Pending" },
    items: [
      {
        description: String,
        dimension: String,
        rate: Number,
        quantity: Number,
        price: { type: Number, default: 0 },
        avatar: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

invoiceModel.pre("save", async function (next) {
  if (!this.invoice_id) {
    let counter = await Counter.findOneAndUpdate(
      { name: "invoice" },
      { $inc: { lastUsedId: 1 } },
      { new: true, upsert: true }
    );

    this.invoice_id = 1000 + counter.lastUsedId;
  }

  next();
});

const InvoiceModal = mongoose.model("Invoice", invoiceModel);

module.exports = InvoiceModal;
