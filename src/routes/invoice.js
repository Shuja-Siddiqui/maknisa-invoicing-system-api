const { Invoice } = require("../handlers");
const router = require("express").Router();
const handler = new Invoice();

router.post("/", handler.saveInvoice);
router.get("/", handler.getInvoices);
router.get("/drafts", handler.getDrafts);
router.get("/:id", handler.getInvoiceById);
router.delete("/:id", handler.removeInvoice);
module.exports = {
  invoice: router,
};
