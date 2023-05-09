const Car = require("./car");

class Slot {
  constructor(slotNo) {
    this.car = null;
    this.slotNo = slotNo;
    this.timestamp = null;
  }

  isEmpty() {
    return this.car === null;
  }

  getCar() {
    return this.car;
  }

  getSlotNumber() {
    return this.slotNo;
  }

  getTimestamp() {
    return this.timestamp;
  }

  parkCar(registrationNumber, timestamp) {
    this.car = new Car(registrationNumber);
    this.timestamp = timestamp;
  }

  unparkCar() {
    this.car = null;
    this.timestamp = null;
  }
}

module.exports = Slot;
