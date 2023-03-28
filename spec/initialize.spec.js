const fs = require("fs").promises;
const path = require("path");

const controller = require("../controllers/parkingController");
const helper = require("./helper/db.helper");
const ParkingSlot = require("../models/parkingSlot");

describe("Initialize suite", function () {
  beforeAll(helper.deleteDB);

  it("should initialize the database ", async function () {
    await controller.initializeApp();
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

  // afterEach(helper.deleteDB);
});
