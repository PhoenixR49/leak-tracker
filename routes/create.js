const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { startMonitor } = require("../bot");

const router = express.Router();

/* POST create page. */
router.post("/create", async (req, res) => {
  const { email, name, keyword, mode, interval, type } = req.body;
  if (email && name && keyword && mode && interval && type) {
    if (parseInt(mode, 10) >= 0 && parseInt(mode, 10) < 5) {
      if (parseInt(type, 10) >= 0 && parseInt(type, 10) < 4) {
        if (parseInt(interval, 10) >= 0 && parseInt(interval, 10) < 9) {
          const JSONData = {
            id: crypto.randomBytes(12).toString("hex"),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            email,
            name,
            keyword,
            status: "STARTING",
            mode: parseInt(mode, 10),
            interval: parseInt(interval, 10),
            type: parseInt(type, 10),
          };

          const monitors = JSON.parse(
            fs.readFileSync(path.join(__dirname, "../monitors.json"))
          );

          const isFound = monitors.some((obj) => obj.name === name);
          if (!isFound) {
            monitors.push(JSONData);

            fs.writeFileSync(
              path.join(__dirname, "../monitors.json"),
              JSON.stringify(monitors)
            );

            res.redirect("/");
            startMonitor(monitors, JSONData);
          } else {
            res.render("index", {
              monitors: JSON.parse(
                fs
                  .readFileSync(path.join(__dirname, "../monitors.json"))
                  .toString("utf-8")
              ),
              info: {
                title: process.env.APP_NAME,
                alert: {
                  type: "error",
                  message: "This name is already used.",
                },
              },
            });
          }
        } else {
          res.render("index", {
            monitors: JSON.parse(
              fs
                .readFileSync(path.join(__dirname, "../monitors.json"))
                .toString("utf-8")
            ),
            info: {
              title: process.env.APP_NAME,
              alert: {
                type: "error",
                message: "Invalid interval",
              },
            },
          });
        }
      } else {
        res.render("index", {
          monitors: JSON.parse(
            fs
              .readFileSync(path.join(__dirname, "../monitors.json"))
              .toString("utf-8")
          ),
          info: {
            title: process.env.APP_NAME,
            alert: {
              type: "error",
              message: "Invalid monitor type",
            },
          },
        });
      }
    } else {
      res.render("index", {
        monitors: JSON.parse(
          fs
            .readFileSync(path.join(__dirname, "../monitors.json"))
            .toString("utf-8")
        ),
        info: {
          title: process.env.APP_NAME,
          alert: {
            type: "error",
            message: "Invalid mode",
          },
        },
      });
    }
  } else {
    res.render("index", {
      monitors: JSON.parse(
        fs
          .readFileSync(path.join(__dirname, "../monitors.json"))
          .toString("utf-8")
      ),
      info: {
        title: process.env.APP_NAME,
        alert: {
          type: "error",
          message: "Some inputs are missing",
        },
      },
    });
  }
});

module.exports = router;
