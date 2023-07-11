const Car = require("../models/car");
const readAndWriteFile = require("../util/fileUtils");

exports.initializeApp = async () => {
  return readAndWriteFile(() => {}, true);
};

exports.parkCar = async (registrationNumber, timestamp) => {
  return readAndWriteFile((lot) => {
    if (!Car.isValidRegistrationNumber(registrationNumber))
      return { error: "Invalid Registration Number" };

    if (lot.findCarSlot(registrationNumber) !== -1)
      return { error: "Vehicle already parked" };

    let index = lot.emptySlotIndex();

    if (index === -1) return { error: "Parking Lot is Full" };

    lot.parkCar(index, registrationNumber, timestamp);

    return { response: index };
  }, true);
};

exports.getCarSlot = async (registrationNumber) => {
  return readAndWriteFile((lot) => {
    let index = lot.findCarSlot(registrationNumber);

    if (index === -1) return { error: `Car ${registrationNumber} not found` };

    return { response: index };
  });
};

exports.unparkCar = async (slotNumber) => {
  return readAndWriteFile((lot) => {
    lot.unparkCar(slotNumber)

    return { response: slotNumber };
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
