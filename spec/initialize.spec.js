const fs = require("fs").promises;
const path = require("path");

const controller = require("../controllers/parking-controller");
const ParkingSlot = require("../models/parking-slot");

describe("Initialize suite", function () {
  it("should initialize the database ", async function () {
    await controller.initialize();
    try {
      const data = await fs.readFile(path.join("db", "db.json"), "utf8");
      const lot = JSON.stringify(
        [...Array(10).keys()].map((i) => new ParkingSlot(i))
      );
      expect(data).toEqual(lot);
    } catch (err) {
      console.log(err);
    }
  });
});
