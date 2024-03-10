const express = require("express");
const fs = require("fs");
const path = require("path");
const validator = require("validator").default;

const router = express.Router();

/* GET update page. */
router.post("/update", async (req, res) => {
  const { email, name, keyword, mode, interval, type } = req.body;
  if (email && name && keyword && mode && interval && type && req.query.id) {
    if (validator.isURL(email)) {
      if (parseInt(mode, 10) >= 0 && parseInt(mode, 10) < 2) {
        if (parseInt(type, 10) >= 0 && parseInt(type, 10) < 5) {
          if (parseInt(interval, 10) >= 0 && parseInt(interval, 10) < 8) {
            const monitors = JSON.parse(
              fs.readFileSync(path.join(__dirname, "../monitors.json"), "utf-8")
            );
            for (let i = 0; i < monitors.length; i += 1) {
              if (monitors[i].id === req.query.id) {
                Object.assign(monitors[i], {
                  email,
                  name,
                  keyword,
                  mode: parseInt(mode, 10),
                  interval: parseInt(interval, 10),
                  type: parseInt(type, 10),
                });
                fs.writeFileSync(
                  path.join(__dirname, "../monitors.json"),
                  JSON.stringify(monitors)
                );
              }
            }
            res.redirect("/");
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
            message: "Invalid Email",
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
