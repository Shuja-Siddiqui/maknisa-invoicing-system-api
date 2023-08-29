const Response = require("./Response");
const fs = require("node:fs");
const path = require("node:path");

class Files extends Response {
  upload = (req, res) => {
    try {
      const { avatar } = req.files;
      if (!avatar)
        return this.sendResponse(res, req, {
          status: 400,
          message: "Failed to upload image",
        });
      const name = `${Date.now()}-${avatar?.name}`;
      fs.writeFileSync(
        path.join(__dirname, `../../public/${name}`),
        Buffer.from(avatar?.data)
      );
      return this.sendResponse(res, req, {
        status: 200,
        data: {
          fileName: name,
        },
      });
    } catch (err) {
      console.error(err);
      return this.sendResponse(res, req, {
        status: 500,
        message: "Internal Server Error",
      });
    }
  };
}

module.exports = { Files };
