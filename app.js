var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var hbs = require("hbs");
const controller = require("./controllers/parking-controller");

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));

hbs.registerPartials(path.join(__dirname, "views", "partials"));

app.post("/park", function (req, res, next) {
  controller
    .parkCar(req.body.registration_number, req.body.timestamp)
    .then((response) => {
      if (response.error) res.status(400).send(response);
      else res.send(response);
    });
});

app.post("/unpark", function (req, res, next) {
  controller.unparkCar(req.body.registration_number).then((response) => {
    if (response.error) res.status(400).send(response);
    else res.send(response);
  });
});

app.get("/", function (req, res, next) {
  controller.initialize().then(() => {
    res.render("index", {
      title: "Park Car | Kushal Parking",
      active: { park_car: true },
    });
  });
});

app.get("/find-car", function (req, res, next) {
  controller.initialize().then(() => {
    res.render("find-car", {
      title: "Find Car | Kushal Parking",
      active: { find_car: true },
    });
  });
});

app.get("/recent-cars", function (req, res, next) {
  controller.getRecentCars().then((response) => {
    if (response.error) res.status(400).send(response);
    else
      res.render("recent-cars", {
        title: "Recent Cars | Kushal Parking",
        active: { recent_cars: true },
        recent_vehicles: response.response,
      });
  });
});

app.get("/all-cars", function (req, res, next) {
  controller.getAllCars().then((response) => {
    if (response.error) res.status(400).send(response);
    else
      res.render("all-cars", {
        title: "All Cars | Kushal Parking",
        active: { all_cars: true },
        all_vehicles: response.response,
      });
  });
});

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
