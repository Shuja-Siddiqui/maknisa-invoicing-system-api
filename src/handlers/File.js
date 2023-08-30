const Response = require("./Response");
const fs = require("node:fs");
const path = require("node:path");

class Files extends Response {
  upload = (req, res) => {
    try {
      const avatar = req.files ? req.files.avatar : null;
      if (avatar !== null) {
        const name = `${Date.now()}-${avatar.name}`;
        fs.writeFileSync(
          path.join(__dirname, `../../public/${name}`),
          Buffer.from(avatar.data)
        );

        return this.sendResponse(res, req, {
          status: 200,
          data: {
            fileName: name,
          },
        });
      } else {
        return this.sendResponse(res, req, {
          status: 200,
          message: "Image not provided. No action taken.",
          data: {
            fileName: "null",
          },
        });
      }
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
