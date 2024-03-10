const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

/* GET delete page. */
router.get("/delete", async (req, res) => {
  if (req.query.id) {
    const monitors = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../monitors.json"), "utf-8")
    );
    for (let i = 0; i < monitors.length; i += 1) {
      if (monitors[i].id === req.query.id) {
        monitors.splice(i, 1);
        fs.writeFileSync(
          path.join(__dirname, "../monitors.json"),
          JSON.stringify(monitors)
        );
      }
    }
  }
  res.redirect("/");
});

module.exports = router;
