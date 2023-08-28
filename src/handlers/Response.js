class Response {
  sendResponse = (res, req, obj) => {
    if (!obj?.status) {
      obj.status = 200;
    }
    if (!obj?.message && !obj?.data) {
      obj.message = "Data/Message is required";
      obj.status = 405;
    }
    obj.token = req?.token;
    return res.status(obj?.status).json(obj);
  };
}

module.exports = Response;
