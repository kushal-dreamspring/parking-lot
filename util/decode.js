const ParkingSlot = require("../models/parkingSlot");

const decode = (string) => {
  const data = JSON.parse(string);
  return data.map((slot) => {
    const object = new ParkingSlot(slot.slot_no);

    if(slot.car) object.parkCar(slot.car.registration_number, slot.timestamp);

    return object;
  });
};

module.exports = decode;
