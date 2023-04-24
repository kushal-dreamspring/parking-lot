const Car = require("../models/car");
const readAndWriteFile = require("../util/fileUtils");

exports.initializeApp = async () => {
  return readAndWriteFile(() => {}, true);
};

exports.parkCar = async (registration_number, timestamp) => {
  return readAndWriteFile((lot) => {
    if (!Car.isValidRegistrationNumber(registration_number))
      return { error: "Invalid Registration Number" };

    if (lot.findCarSlot(registration_number) !== -1)
      return { error: "Vehicle already parked" };

    let index = lot.findEmptySlot();

    if (index === -1) return { error: "Parking Lot is Full" };

    lot.parkCar(index, registration_number, timestamp);

    return { response: index };
  }, true);
};

exports.getCarSlot = async (registration_number) => {
  return readAndWriteFile((lot) => {
    let index = lot.findCarSlot(registration_number);

    if (index === -1) return { error: "Vehicle not found" };

    return { response: index };
  });
};

exports.unparkCar = async (slot_number) => {
  return readAndWriteFile((lot) => {
    lot.unparkCar(slot_number)

    return { response: slot_number };
  }, true);
};

exports.getRecentCars = async () => {
  return readAndWriteFile((lot) => {
    return {
      response: lot.getRecentCars(),
    };
  });
};

exports.getAllCars = async () => {
  return readAndWriteFile((lot) => {
    return {
      response: lot.getAllCars(),
    };
  });
};
