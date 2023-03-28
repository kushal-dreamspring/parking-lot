const fs = require("fs").promises;
const path = require("path");

const controller = require("../controllers/parkingController");
const helper = require("./helper/db.helper");
const ParkingSlot = require("../models/parkingSlot");

describe("Park Car Suite", function () {
  beforeEach(helper.newDB);

  it("should not park a car with invalid registration number", async function () {
    try {
      const data = await controller.parkCar("A", Date.now());

      expect(data).toEqual({ error: "Invalid Registration Number" });
    } catch (err) {
      console.log(err);
    }
  });

  it("should park a car with valid registration number", async function () {
    try {
      const registration_number = "abcdefghij";
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
        await controller.parkCar("ab12cd123" + i.toString(), Date.now());

      const data = await controller.parkCar("ab12cd1240", Date.now());

      expect(data).toEqual({ error: "Parking Lot is Full" });
    } catch (err) {
      console.log(err);
    }
  });

  it("should not park same car twice", async function () {
    try {
      await controller.parkCar("ab12cd1234", Date.now());

      const data = await controller.parkCar("ab12cd1234", Date.now());

      expect(data).toEqual({ error: "Vehicle already parked" });
    } catch (err) {
      console.log(err);
    }
  });
});
