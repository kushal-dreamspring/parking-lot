const fs = require("fs").promises;
const path = require("path");

const ParkingSlot = require("../models/parkingSlot");

const assignClass = (string) => {
  const data = JSON.parse(string);
  return data.map((slot) => {
    const object = new ParkingSlot(slot.slot_no);

    if (slot.car) object.parkCar(slot.car.registration_number, slot.timestamp);

    return object;
  });
};

const readAndWriteFile = async (callback, writeBack = false) => {
  try {
    const lot = assignClass(await fs.readFile(path.join("db", "db.json"), "utf8"));

    const response = callback(lot);

    if (writeBack)
      await fs.writeFile(
        path.join("db", "db.json"),
        JSON.stringify(lot),
        "utf-8"
      );

    return response;
  } catch (err) {
    return { error: err };
  }
};

module.exports = readAndWriteFile;
