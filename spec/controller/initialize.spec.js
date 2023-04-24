const fs = require("fs").promises;
const path = require("path");

const controller = require("../../controllers/controller");
const helper = require("../helper/db.helper");
const Slot = require("../../models/slot");

describe("Initialize suite", function () {
  beforeAll(helper.deleteDB);

  it("should initialize the database ", async function () {
    await controller.initializeApp();
    try {
      const data = await fs.readFile(path.join("db", "db.json"), "utf8");
      const lot = JSON.stringify(
        [...Array(10).keys()].map((i) => new Slot(i))
      );
      expect(data).toEqual(lot);
    } catch (err) {
      console.log(err);
    }
  });

  // afterEach(helper.deleteDB);
});
