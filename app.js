const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const hbs = require("hbs");
const controller = require("./controllers/controller");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(
  "/stylesheets",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/javascripts",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);

hbs.registerPartials(path.join(__dirname, "views", "partials"));

app.post("/park", function (req, res, next) {
  controller
    .parkCar(req.body.registrationNumber, req.body.timestamp)
    .then((response) => {
      if (response.error) res.status(400).send(response);
      else res.send(response);
    });
});

app.get("/car-slot", function (req, res, next) {
  controller.getCarSlot(req.query.registrationNumber).then((response) => {
    if (response.error) res.status(400).send(response);
    else res.send(response);
  });
});

app.post("/unpark", function (req, res, next) {
  controller.unparkCar(req.body.slotNumber).then((response) => {
    if (response.error) res.status(400).send(response);
    else res.send(response);
  });
});

app.get("/", function (req, res, next) {
  controller.initializeApp().then(() => {
    res.render("index", {
      title: "Park Car | Kushal Parking",
      active: { parkCar: true },
    });
  });
});

app.get("/recent-cars", function (req, res, next) {
  controller.getRecentCars().then((response) => {
    if (response.error) res.status(400).send(response);
    else res.send({ response: response.response });
  });
});

app.get("/all-cars", function (req, res, next) {
  controller.getAllCars().then((response) => {
    if (response.error) res.status(400).send(response);
    else res.send({ response: response.response });
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
