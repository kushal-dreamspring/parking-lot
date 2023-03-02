const fs = require("fs").promises;
const path = require("path");

const controller = require("../controllers/parking-controller");
const helper = require("./helper/db.helper");
const ParkingSlot = require("../models/parking-slot");

describe("Unpark Car Suite", function () {
  beforeEach(helper.newDB);

  it("should not unpark a car which is not parked", async function () {
    try {
      const data = await controller.unparkCar("A");

      expect(data).toEqual({ error: "Vehicle not found" });
    } catch (err) {
      console.log(err);
    }
  });

  it("should unpark a parked car", async function () {
    try {
      await controller.parkCar("A", Date.now());

      await controller.unparkCar("A");

      const data = await fs.readFile(path.join("db", "db.json"), "utf8");
      const lot = [...Array(10).keys()].map((i) => new ParkingSlot(i));

      expect(data).toEqual(JSON.stringify(lot));
    } catch (err) {
      console.log(err);
    }
  });
});
