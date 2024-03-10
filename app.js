const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { startMonitors } = require("./bot");
require("dotenv").config();

const app = express();

startMonitors();

const indexRouter = require("./routes/index");
const createRouter = require("./routes/create");
const updateRouter = require("./routes/update");
const deleteRouter = require("./routes/delete");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(
  "/static/libs/bootstrap",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist"))
);
app.use(
  "/static/libs/bootstrap-icons",
  express.static(path.join(__dirname, "node_modules/bootstrap-icons/font"))
);

app.use("/", indexRouter);
app.use("/", createRouter);
app.use("/", updateRouter);
app.use("/", deleteRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
