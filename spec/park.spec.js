const fs = require("fs").promises;
const path = require("path");

const controller = require("../controllers/parking-controller");
const helper = require("./helper/db.helper");
const ParkingSlot = require("../models/parking-slot");

describe("Park Car Suite", function () {
  beforeEach(helper.newDB);

  it("should park a car", async function () {
    try {
      const registration_number = "A";
      const timestamp = Date.now();
      await controller.parkCar(registration_number, timestamp);

      const data = await fs.readFile(path.join("db", "db.json"), "utf8");
      const lot = [...Array(10).keys()].map((i) => new ParkingSlot(i));
      lot[0] = {
        car: { registration_number },
        slot_no: 0,
        timestamp,
      };

      expect(data).toEqual(JSON.stringify(lot));
    } catch (err) {
      console.log(err);
    }
  });

  it("should not park more than 10 cars", async function () {
    try {
      for (let i = 0; i < 10; i++)
        await controller.parkCar(i.toString(), Date.now());

      const data = await controller.parkCar(10, Date.now());

      expect(data).toEqual({ error: "Parking Lot is Full" });
    } catch (err) {
      console.log(err);
    }
  });

  it("should not park same park twice", async function () {
    try {
      await controller.parkCar("A", Date.now());

      const data = await controller.parkCar("A", Date.now());

      expect(data).toEqual({ error: "Vehicle already parked" });
    } catch (err) {
      console.log(err);
    }
  });
});
