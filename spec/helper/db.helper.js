const fs = require("fs").promises;
const path = require("path");

const ParkingSlot = require("../../models/parking-slot");


exports.newDB = async () => {
  try {
    const lot = [...Array(10).keys()].map((i) => new ParkingSlot(i));
    await fs.writeFile(path.join("db", "db.json"), JSON.stringify(lot));
  } catch (err) {
    console.log(err);
  }
};

exports.deleteDB = async () => {
  try {
    await fs.unlink(path.join("db", "db.json"), "utf8");
  } catch (err) {
    console.log(err);
  }
};
