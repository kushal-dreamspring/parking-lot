const fs = require("fs").promises;
const path = require("path");

const Slot = require("../../models/slot");


exports.newDB = async () => {
  try {
    const lot = [...Array(10).keys()].map((i) => new Slot(i));
    await fs.writeFile(path.join("db", "db.json"), JSON.stringify(lot));
  } catch (err) {
    console.log(err);
  }
};

exports.deleteDB = async () => {
  try {
    await fs.writeFile(path.join("db", "db.json"), "[]", "utf-8");
  } catch (err) {
    console.log(err);
  }
};
