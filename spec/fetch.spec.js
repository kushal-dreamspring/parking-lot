const fs = require("fs").promises;
const path = require("path");

const controller = require("../controllers/parking-controller");
const helper = require("./helper/db.helper");
const ParkingSlot = require("../models/parking-slot");

describe("Recent Car Suite", function () {
  beforeEach(helper.newDB);

  it("should fetch recent 3 recently parked cars", async function () {
    try {
      const timestamp = Date.now();
      for (let i = 0; i < 6; i++)
        await controller.parkCar(i, timestamp + i * 1000);

      const data = JSON.stringify(await controller.getRecentCars());
      const recentCars = {
        response: [
          {
            car: { registration_number: 5 },
            slot_no: 5,
            timestamp: new Date(timestamp + 5000).toLocaleString(),
          },
          {
            car: { registration_number: 4 },
            slot_no: 4,
            timestamp: new Date(timestamp + 4000).toLocaleString(),
          },
          {
            car: { registration_number: 3 },
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
        await controller.parkCar(i, timestamp + i * 1000);

      const data = JSON.stringify(await controller.getAllCars());
      const recentCars = {
        response: [
          {
            car: { registration_number: 0 },
            slot_no: 0,
            timestamp: new Date(timestamp).toLocaleString(),
          },
          {
            car: { registration_number: 1 },
            slot_no: 1,
            timestamp: new Date(timestamp + 1000).toLocaleString(),
          },
          {
            car: { registration_number: 2 },
            slot_no: 2,
            timestamp: new Date(timestamp + 2000).toLocaleString(),
          },
          {
            car: { registration_number: 3 },
            slot_no: 3,
            timestamp: new Date(timestamp + 3000).toLocaleString(),
          },
          {
            car: { registration_number: 4 },
            slot_no: 4,
            timestamp: new Date(timestamp + 4000).toLocaleString(),
          },
          {
            car: { registration_number: 5 },
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
