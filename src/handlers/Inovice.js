const Response = require("./Response");
const { InvoiceModal } = require("../models");

class Invoice extends Response {
  saveInvoice = async (req, res) => {
    try {
      const newInvoice = new InvoiceModal({
        client_name: "",
        location: {
          details: "",
          area: "",
          city: "",
          province: "",
        },
        category: "",
        making_time: "",
        terms:
          "Foam quality<br />Master Molty Furniture to be delivered after construction completion of house Wood quality<br />Sheesham Wood Polish included Imported fabric on sofas same quality as pictures<br /> Cushions as per client demand <br /> Carriage will be paid by customer <br />Mattress will not be included <br /> 50% payment in advance 30% before polish and poslish 20% before delivery",
        payment: "",
        price:0,
        discount: 0,
        items: [],
        completed: false,
        status: "Pending",
      });
      const data = await newInvoice.save();
      return this.sendResponse(res, req, {
        message: "Invoice Saved",
        status: 201,
        data,
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(res, req, {
        message: "Internal server error",
        status: 500,
      });
    }
  };
  updateInvoice = async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const updated = await InvoiceModal.updateOne(
        { _id: id },
        { $set: { ...data } }
      );
      if (updated.modifiedCount < 1) {
        return this.sendResponse(res, req, {
          message: "Failed to update",
          status: 400,
        });
      }
      return this.sendResponse(res, req, {
        status: 200,
        data: updated,
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(res, req, {
        message: "Error Fetching Invoice",
        status: 500,
        data: null,
      });
    }
  };
  updateItem = async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const { index } = req.body;
      if (!id) {
        return this.sendResponse(res, req, {
          status: 400,
          message: "ID is required",
        });
      }
      const invoice = await InvoiceModal.findById(id);
      if (!invoice) {
        return this.sendResponse(res, req, {
          status: 404,
          message: "Invoice not found",
        });
      }
      const { items } = invoice;
      items[index] = data;
      const update = await InvoiceModal.updateOne(
        { _id: id },
        { $set: { items } }
      );

      if (update?.modifiedCount < 1) {
        return this.sendResponse(res, req, {
          status: 400,
          message: "Failed to update items list",
        });
      }

      return this.sendResponse(res, req, {
        status: 200,
        message: "Updated items list",
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(res, req, {
        message: "Error updating item in items array",
        status: 500,
        data: null,
      });
    }
  };
  deleteItem = async (req, res) => {
    try {
      const { id } = req.params;
      const { index } = req.query;
      if (!id) {
        return this.sendResponse(res, req, {
          status: 400,
          message: "ID is required",
        });
      }
      const invoice = await InvoiceModal.findById(id);
      if (!invoice) {
        return this.sendResponse(res, req, {
          status: 404,
          message: "Invoice not found",
        });
      }
      const { items } = invoice;
      console.log(index);
      items.splice(index, 1);
      const update = await InvoiceModal.updateOne(
        { _id: id },
        { $set: { items } }
      );
      if (update.modifiedCount < 1) {
        return this.sendResponse(res, req, {
          status: 400,
          message: "Failed to update items list",
        });
      }

      return this.sendResponse(res, req, {
        status: 200,
        message: "Updated items list",
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(res, req, {
        message: "Error updating item in items array",
        status: 500,
        data: null,
      });
    }
  };
  updateItemsArray = async (req, res) => {
    try {
      const { id } = req.params;
      const { addedItems } = req.body; // Assuming your request body contains an array of items

      // Find the invoice by its ID
      const existingInvoice = await InvoiceModal.findById(id);

      if (!existingInvoice) {
        return this.sendResponse(res, req, {
          message: "Invoice not found",
          status: 404,
        });
      }

      const { items } = existingInvoice;
      // Push the new items to the existing items array
      items.push(addedItems);
      const updateExisting = await InvoiceModal.updateOne(
        { _id: id },
        { $set: { items } }
      );

      // Save the updated invoice document
      // const updatedInvoice = await existingInvoice.save();
      if (updateExisting.modifiedCount > 0)
        return this.sendResponse(res, req, {
          status: 200,
          message: "Item added",
        });
      return this.sendResponse(res, req, {
        status: 400,
        message: "Failed to update",
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(res, req, {
        message: "Error updating items array",
        status: 500,
        data: null,
      });
    }
  };
  patchInvoice = async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await InvoiceModal.updateOne(
        { _id: id },
        { $set: { completed: true } }
      );
      if (updated.modifiedCount < 1) {
        return this.sendResponse(res, req, {
          message: "Failed to update",
          status: 400,
        });
      }
      return this.sendResponse(res, req, {
        status: 200,
        data: updated,
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(res, req, {
        message: "Error Fetching Invoice",
        status: 500,
        data: null,
      });
    }
  };

  patchInvoiceStatus = async (req, res) => {
    try {
      const { invoiceData } = req.body;
      const { invoiceStatus, statusId } = invoiceData;
      if (invoiceStatus !== "undefined") {
        const updatedStatus = await InvoiceModal.updateOne(
          { _id: statusId },
          {
            $set: {
              currentStatus: invoiceStatus,
            },
          }
        );
        if (updatedStatus.modifiedCount < 1) {
          return this.sendResponse(res, req, {
            message: "Failed to update status",
            status: 400,
          });
        }

        return this.sendResponse(res, req, {
          status: 200,
          data: updatedStatus,
        });
      }
    } catch (err) {
      console.log(err);
      return this.sendResponse(res, req, {
        message: "Error Fetching Invoice",
        status: 500,
        data: null,
      });
    }
  };
  getInvoices = async (req, res) => {
    try {
      const invoices = await InvoiceModal.find({ completed: true }).sort({
        updatedAt: -1,
      });
      return this.sendResponse(res, req, {
        message: "All Completed Invoices Fetched",
        status: 201,
        invoices,
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(res, req, {
        message: "Error Fetching Invoices",
        status: 500,
        data: null,
      });
    }
  };
  getDrafts = async (req, res) => {
    try {
      const invoices = await InvoiceModal.find({ completed: false }).sort({
        updatedAt: -1,
      });
      return this.sendResponse(res, req, {
        message: "All Drafts Invoices Fetched",
        status: 201,
        data: invoices,
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(res, req, {
        message: "Error Fetching Drafts",
        status: 500,
        data: null,
      });
    }
  };
  getInvoiceById = async (req, res) => {
    const invoiceId = req.params.id;
    try {
      const invoice = await InvoiceModal.findById({ _id: invoiceId });

      if (!invoice) {
        return this.sendResponse(res, {
          message: "Invoice not found",
          status: 404,
          data: null,
        });
      }

      return this.sendResponse(res, req, {
        message: "Invoice Fetched Successfully",
        status: 200,
        data: invoice,
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(res, req, {
        message: "Error Fetching Invoice",
        status: 500,
        data: null,
      });
    }
  };
  removeInvoice = async (req, res) => {
    const invoiceId = req.params.id;
    try {
      const invoice = await InvoiceModal.findOneAndDelete({ _id: invoiceId });

      if (!invoice) {
        return this.sendResponse(res, req, {
          message: "Invoice not found",
          status: 404,
          data: null,
        });
      }

      return this.sendResponse(res, req, {
        message: "Invoice Deleted Successfully",
        status: 200,
        invoice,
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(res, req, {
        message: "Error Fetching Invoice",
        status: 500,
        data: null,
      });
    }
  };
}
module.exports = {
  Invoice,
};
