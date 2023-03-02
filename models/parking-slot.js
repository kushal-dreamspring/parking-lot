const Car = require("./car");

class ParkingSlot {
  constructor(slot_no) {
    this.car = null;
    this.slot_no = slot_no;
    this.timestamp = 0;
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

  parkCar(registration_number, timestamp) {
    this.car = new Car(registration_number);
    this.timestamp = timestamp;
  }

  unparkCar() {
    this.car = null;
    this.timestamp = 0;
  }
}

module.exports = ParkingSlot;
