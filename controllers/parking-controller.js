const path = require("path");
const Car = require("../models/car");
const fs = require("fs").promises;

const ParkingSlot = require("../models/parking-slot");
const decode = require("../util/decode");

const lot_size = 10;

exports.initialize = async () => {
  try {
    let lot = await fs.readFile(path.join("db", "db.json"), "utf8");
    if (!lot) {
      lot = [...Array(lot_size).keys()].map((i) => new ParkingSlot(i));
      await fs.writeFile(path.join("db", "db.json"), JSON.stringify(lot));
    }
  } catch (err) {
    console.log(err);
  }
};

exports.parkCar = async (registration_number, timestamp) => {
  try {
    if (!Car.isValidRegistrationNumber(registration_number))
      return { error: "Invalid Registration Number" };

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

exports.getCarSlot = async (registration_number) => {
  try {
    const data = await fs.readFile(path.join("db", "db.json"), "utf8");

    const lot = decode(data);

    let index = -1;
    for (const slot of lot) {
      const car = slot.getCar();
      if (car && car.getRegistrationNumber() === registration_number) {
        index = slot.getSlotNumber();
        break;
      }
    }

    if (index === -1) return { error: "Vehicle not found" };

    return { response: index };
  } catch (err) {
    console.log(err);
  }
};

exports.unparkCar = async (slot_number) => {
  try {
    const data = await fs.readFile(path.join("db", "db.json"), "utf8");

    const lot = decode(data);
    lot[slot_number].unparkCar();

    await fs.writeFile(path.join("db", "db.json"), JSON.stringify(lot));

    return { response: slot_number };
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
        .filter((el) => !el.isEmpty())
        .sort((a, b) => b.getTimestamp() - a.getTimestamp())
        .slice(0, 3)
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
