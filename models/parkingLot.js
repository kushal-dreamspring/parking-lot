const Slot = require("./slot");
const { DEFAULT_LOT_SIZE } = require('../config/constants')

class ParkingLot {
  constructor(fileData, lotSize = DEFAULT_LOT_SIZE) {
    this.lot = [];
    const data = fileData ? JSON.parse(fileData) : [];

    if (!data || data.length === 0)
      this.lot = [...Array(lotSize).keys()].map((i) => new Slot(i));
    else this.insertData(data);
  }

  insertData(data) {
    this.lot = data.map((slot) => {
      const object = new Slot(slot.slotNo);

      if (slot.car) object.parkCar(slot.car.registrationNumber, slot.timestamp);

      return object;
    });
  }

  emptySlotIndex() {
    let index = -1;

    for (let i in this.lot) {
      if (this.lot[i].isEmpty()) {
        index = i;
        break;
      }
    }

    return index;
  }

  parkCar(index, registrationNumber, timestamp) {
    this.lot[index].parkCar(registrationNumber, timestamp);
  }

  findCarSlot(registrationNumber) {
    for (let slot of this.lot) {
      const car = slot.getCar();
      if (car && car.getRegistrationNumber() === registrationNumber)
        return slot.getSlotNumber();
    }

    return -1;
  }

  unparkCar(index) {
    this.lot[index].unparkCar();
  }

  getAllCars() {
    return this.lot
      .filter((el) => !el.isEmpty())
      .map((el) => ({
        ...el,
        timestamp: new Date(el.timestamp).toLocaleString(),
      }));
  }

  getRecentCars() {
    return this.lot
      .filter((el) => !el.isEmpty())
      .sort((a, b) => b.getTimestamp() - a.getTimestamp())
      .slice(0, 3)
      .map((el) => ({
        ...el,
        timestamp: new Date(el.timestamp).toLocaleString(),
      }));
  }
}

module.exports = ParkingLot;
