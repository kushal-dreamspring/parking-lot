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
      const lot = JSON.stringify([...Array(10).keys()].map((i) => new Slot(i)));
      expect(data).toEqual(lot);
    } catch (err) {
      console.log(err);
    }
  });

  // afterEach(helper.deleteDB);
});

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
      const registration_number = "UP32EA7196";
      const timestamp = Date.now();
      await controller.parkCar(registration_number, timestamp);

      const data = await fs.readFile(path.join("db", "db.json"), "utf8");
      const lot = [...Array(10).keys()].map((i) => new Slot(i));
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

describe("Unpark Car Suite", function () {
  beforeEach(helper.newDB);

  it("should not unpark a car which is not parked", async function () {
    try {
      const data = await controller.getCarSlot("ab12cd1234");

      expect(data).toEqual({ error: "Vehicle not found" });
    } catch (err) {
      console.log(err);
    }
  });

  it("should unpark a parked car", async function () {
    try {
      await controller.parkCar("ab12cd1234", Date.now());
      await controller.unparkCar(
        (
          await controller.getCarSlot("ab12cd1234")
        ).response
      );

      const data = await fs.readFile(path.join("db", "db.json"), "utf8");
      const lot = [...Array(10).keys()].map((i) => new Slot(i));

      expect(data).toEqual(JSON.stringify(lot));
    } catch (err) {
      console.log(err);
    }
  });
});

describe("Recent Car Suite", function () {
  beforeEach(helper.newDB);

  it("should fetch recent 3 recently parked cars", async function () {
    try {
      const timestamp = Date.now();
      for (let i = 0; i < 6; i++)
        await controller.parkCar(
          "ab12cd123" + i.toString(),
          timestamp + i * 1000
        );

      const data = JSON.stringify(await controller.getRecentCars());
      const recentCars = {
        response: [
          {
            car: { registration_number: "ab12cd1235" },
            slot_no: 5,
            timestamp: new Date(timestamp + 5000).toLocaleString(),
          },
          {
            car: { registration_number: "ab12cd1234" },
            slot_no: 4,
            timestamp: new Date(timestamp + 4000).toLocaleString(),
          },
          {
            car: { registration_number: "ab12cd1233" },
            slot_no: 3,
            timestamp: new Date(timestamp + 3000).toLocaleString(),
          },
        ],
      };

      expect(data).toEqual(JSON.stringify(recentCars));
    } catch (err) {
      console.log(err);
    }
  });
});

describe("All Cars Suite", function () {
  beforeEach(helper.newDB);

  it("should fetch all parked cars", async function () {
    try {
      const timestamp = Date.now();
      for (let i = 0; i < 6; i++)
        await controller.parkCar(
          "ab12cd123" + i.toString(),
          timestamp + i * 1000
        );

      const data = JSON.stringify(await controller.getAllCars());
      const recentCars = {
        response: [
          {
            car: { registration_number: "ab12cd1230" },
            slot_no: 0,
            timestamp: new Date(timestamp).toLocaleString(),
          },
          {
            car: { registration_number: "ab12cd1231" },
            slot_no: 1,
            timestamp: new Date(timestamp + 1000).toLocaleString(),
          },
          {
            car: { registration_number: "ab12cd1232" },
            slot_no: 2,
            timestamp: new Date(timestamp + 2000).toLocaleString(),
          },
          {
            car: { registration_number: "ab12cd1233" },
            slot_no: 3,
            timestamp: new Date(timestamp + 3000).toLocaleString(),
          },
          {
            car: { registration_number: "ab12cd1234" },
            slot_no: 4,
            timestamp: new Date(timestamp + 4000).toLocaleString(),
          },
          {
            car: { registration_number: "ab12cd1235" },
            slot_no: 5,
            timestamp: new Date(timestamp + 5000).toLocaleString(),
          },
        ],
      };

      expect(data).toEqual(JSON.stringify(recentCars));
    } catch (err) {
      console.log(err);
    }
  });
});
