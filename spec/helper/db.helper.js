const fs = require("fs").promises;
const path = require("path");

const Slot = require("../../models/slot");

const { DEFAULT_LOT_SIZE } = require('../../config/constants')

exports.newDB = async () => {
  try {
    const lotSize = DEFAULT_LOT_SIZE;
    const lot = [...Array(lotSize).keys()].map((i) => new Slot(i));
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
