const { Invoice } = require("../handlers");
const router = require("express").Router();
const handler = new Invoice();

router.post("/", handler.saveInvoice);
router.put("/update-invoice/:id", handler.updateInvoice);
router.patch("/:id", handler.updateItemsArray);
router.patch("/genrate-invoice/:id", handler.patchInvoice);
router.patch("/update-status/:id", handler.patchInvoiceStatus);
router.put("/updateItem/:id", handler.updateItem);
router.delete("/deleteItem/:id", handler.deleteItem);
router.get("/get-all", handler.getInvoices);
router.get("/drafts", handler.getDrafts);
router.get("/:id", handler.getInvoiceById);
router.delete("/:id", handler.removeInvoice);
module.exports = {
  invoice: router,
};
