const Car = require("./car");

class Slot {
  constructor(slot_no) {
    this.car = null;
    this.slot_no = slot_no;
    this.timestamp = null;
  }

  isEmpty() {
    return this.car === null;
  }

  getCar() {
    return this.car;
  }

  getSlotNumber() {
    return this.slot_no;
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
