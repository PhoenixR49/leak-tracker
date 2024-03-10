const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

/* GET home page. */
router.get("/", async (req, res) => {
  const monitors = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../monitors.json")).toString("utf-8")
  );

  res.render("index", {
    monitors,
    info: {
      title: process.env.APP_NAME,
      alert: undefined,
    },
  });
});

module.exports = router;
