const path = require("path");
const fs = require("fs").promises;

const ParkingSlot = require("../models/parking-slot");
const decode = require("../util/decode");

const lot_size = 10;

exports.initialize = async () => {
  try {
    try {
      await fs.readFile(path.join("db", "db.json"), "utf8");
    } catch (err1) {
      const lot = [...Array(lot_size).keys()].map((i) => new ParkingSlot(i));
      await fs.writeFile(path.join("db", "db.json"), JSON.stringify(lot));
    }
  } catch (err) {
    console.log(err);
  }
};

exports.parkCar = async (registration_number, timestamp) => {
  try {
    const data = await fs.readFile(path.join("db", "db.json"), "utf8");
    const lot = decode(data);

    for (let slot of lot) {
      const car = slot.getCar();
      if (car && car.getRegistrationNumber() === registration_number)
        return { error: "Vehicle already parked" };
    }

    let index = -1;

    for (let i in lot) {
      if (lot[i].isEmpty()) {
        lot[i].parkCar(registration_number, timestamp);
        index = i;
        break;
      }
    }

    if (index === -1) return { error: "Parking Lot is Full" };

    await fs.writeFile(path.join("db", "db.json"), JSON.stringify(lot));

    return { response: index };
  } catch (err) {
    console.log(err);
  }
};

exports.unparkCar = async (registration_number) => {
  try {
    const data = await fs.readFile(path.join("db", "db.json"), "utf8");

    const lot = decode(data);

    let index = -1;
    for (const slot of lot) {
      const car = slot.getCar();
      if (car && car.getRegistrationNumber() === registration_number) {
        slot.unparkCar();
        index = slot.getSlotNumber();
        break;
      }
    }

    if (index === -1) return { error: "Vehicle not found" };

    await fs.writeFile(path.join("db", "db.json"), JSON.stringify(lot));

    return { response: index };
  } catch (err) {
    console.log(err);
  }
};

exports.getRecentCars = async () => {
  try {
    const data = await fs.readFile(path.join("db", "db.json"), "utf8");

    const lot = decode(data);

    return {
      response: lot
        .sort((a, b) => b.getTimestamp() - a.getTimestamp())
        .filter((el) => !el.isEmpty())
        .filter((_, i) => i <= 2)
        .map((el) => ({
          ...el,
          timestamp: new Date(el.timestamp).toLocaleString(),
        })),
    };
  } catch (err) {
    console.log(err);
  }
};

exports.getAllCars = async () => {
  try {
    const data = await fs.readFile(path.join("db", "db.json"), "utf8");

    const lot = decode(data);

    return {
      response: lot
        .filter((el) => !el.isEmpty())
        .map((el) => ({
          ...el,
          timestamp: new Date(el.timestamp).toLocaleString(),
        })),
    };
  } catch (err) {
    console.log(err);
  }
};
