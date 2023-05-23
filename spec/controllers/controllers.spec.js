const fs = require("fs").promises;
const path = require("path");

const controller = require("../../controllers/controller");
const helper = require("../helper/db.helper");
const Slot = require("../../models/slot");

describe("Initialize suite", function () {
  const lotSize = 10;

  it("should initialize the database ", async function () {
    await helper.deleteDB();

    await controller.initializeApp();

    try {
      const data = await fs.readFile(path.join("db", "db.json"), "utf8");
      const lot = JSON.stringify(
        [...Array(lotSize).keys()].map((i) => new Slot(i))
      );
      expect(data).toEqual(lot);
    } catch (err) {
      console.log(err);
    }
  });
});

describe("Park Car Suite", function () {
  const lotSize = 10;

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
      const registrationNumber = "UP32EA7196";
      const timestamp = Date.now();
      await controller.parkCar(registrationNumber, timestamp);

      const data = await fs.readFile(path.join("db", "db.json"), "utf8");
      const lot = [...Array(lotSize).keys()].map((i) => new Slot(i));
      lot[0] = {
        car: { registrationNumber: registrationNumber },
        slotNo: 0,
        timestamp,
      };

      expect(data).toEqual(JSON.stringify(lot));
    } catch (err) {
      console.log(err);
    }
  });

  it("should not park more than size of parking lot", async function () {
    try {
      for (let i = 0; i < lotSize; i++)
        await controller.parkCar("ab12cd123" + i.toString(), Date.now());

      const response = await controller.parkCar("ab12cd1240", Date.now());

      expect(response).toEqual({ error: "Parking Lot is Full" });
    } catch (err) {
      console.log(err);
    }
  });

  it("should not park same car twice", async function () {
    try {
      await controller.parkCar("ab12cd1234", Date.now());

      const response = await controller.parkCar("ab12cd1234", Date.now());

      expect(response).toEqual({ error: "Vehicle already parked" });
    } catch (err) {
      console.log(err);
    }
  });
});

describe("Unpark Car Suite", function () {
  const lotSize = 10;

  beforeEach(helper.newDB);

  it("should not unpark a car which is not parked", async function () {
    try {
      const response = await controller.getCarSlot("ab12cd1234");

      expect(response).toEqual({ error: "Vehicle not found" });
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
      const lot = [...Array(lotSize).keys()].map((i) => new Slot(i));

      expect(data).toEqual(JSON.stringify(lot));
    } catch (err) {
      console.log(err);
    }
  });
});

describe("Recent Car Suite", function () {
  it("should fetch recent 3 recently parked cars", async function () {
    try {
      await helper.newDB();

      const timestamp = Date.now();
      for (let i = 0; i < 6; i++)
        await controller.parkCar(
          "ab12cd123" + i.toString(),
          timestamp + i * 1000
        );

      const response = JSON.stringify(await controller.getRecentCars());
      const recentCars = {
        response: [
          {
            car: { registrationNumber: "ab12cd1235" },
            slotNo: 5,
            timestamp: new Date(timestamp + 5000).toLocaleString(),
          },
          {
            car: { registrationNumber: "ab12cd1234" },
            slotNo: 4,
            timestamp: new Date(timestamp + 4000).toLocaleString(),
          },
          {
            car: { registrationNumber: "ab12cd1233" },
            slotNo: 3,
            timestamp: new Date(timestamp + 3000).toLocaleString(),
          },
        ],
      };

      expect(response).toEqual(JSON.stringify(recentCars));
    } catch (err) {
      console.log(err);
    }
  });
});

describe("All Cars Suite", function () {
  it("should fetch all parked cars", async function () {
    try {
      await helper.newDB();

      const timestamp = Date.now();
      for (let i = 0; i < 6; i++)
        await controller.parkCar(
          "ab12cd123" + i.toString(),
          timestamp + i * 1000
        );

      const response = JSON.stringify(await controller.getAllCars());
      const allCars = {
        response: [
          {
            car: { registrationNumber: "ab12cd1230" },
            slotNo: 0,
            timestamp: new Date(timestamp).toLocaleString(),
          },
          {
            car: { registrationNumber: "ab12cd1231" },
            slotNo: 1,
            timestamp: new Date(timestamp + 1000).toLocaleString(),
          },
          {
            car: { registrationNumber: "ab12cd1232" },
            slotNo: 2,
            timestamp: new Date(timestamp + 2000).toLocaleString(),
          },
          {
            car: { registrationNumber: "ab12cd1233" },
            slotNo: 3,
            timestamp: new Date(timestamp + 3000).toLocaleString(),
          },
          {
            car: { registrationNumber: "ab12cd1234" },
            slotNo: 4,
            timestamp: new Date(timestamp + 4000).toLocaleString(),
          },
          {
            car: { registrationNumber: "ab12cd1235" },
            slotNo: 5,
            timestamp: new Date(timestamp + 5000).toLocaleString(),
          },
        ],
      };

      expect(response).toEqual(JSON.stringify(allCars));
    } catch (err) {
      console.log(err);
    }
  });
});
