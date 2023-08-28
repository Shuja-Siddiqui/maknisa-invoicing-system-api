const Response = require("./Response");
const { InvoiceModal } = require("../models");

class Invoice extends Response {
  saveInvoice = async (req, res) => {
    try {
      const {
        client_name,
        location,
        estimate_time,
        terms,
        discount,
        items,
        completed,
        status,
      } = req.body;
      const newInvoice = new InvoiceModal({
        client_name,
        location,
        estimate_time,
        terms,
        discount,
        items,
        completed,
        status,
      });
      await newInvoice.save();
      return this.sendResponse(res, req, {
        message: "Invoice Saved",
        status: 201,
        newInvoice,
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(res, req, {
        message: "Internal server error",
        status: 500,
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
