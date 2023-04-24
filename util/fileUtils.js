const fs = require("fs").promises;
const path = require("path");

const ParkingLot = require("../models/parkingLot");

const readAndWriteFile = async (callback, writeBack = false) => {
  try {
    const lot = new ParkingLot(await fs.readFile(path.join("db", "db.json"), "utf8"));

    const response = callback(lot);

    if (writeBack)
      await fs.writeFile(
        path.join("db", "db.json"),
        JSON.stringify(lot.lot),
        "utf-8"
      );

    return response;
  } catch (err) {
    return { error: err };
  }
};

module.exports = readAndWriteFile;
