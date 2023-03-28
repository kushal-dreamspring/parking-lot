const ParkingSlot = require("../models/parkingSlot");
const Car = require("../models/car");
const readAndWriteFile = require("../util/fileUtils");

const lot_size = 10;

const isCarParked = (lot, registration_number) => {
  for (let slot of lot) {
    const car = slot.getCar();
    if (car && car.getRegistrationNumber() === registration_number) return true;
  }

  return false;
};

const findEmptySlot = (lot) => {
  let index = -1;

  for (let i in lot) {
    if (lot[i].isEmpty()) {
      index = i;
      break;
    }
  }

  return index;
};

exports.initializeApp = async () => {
  return readAndWriteFile((lot) => {
    if (!lot || lot.length === 0)
      lot = [...Array(lot_size).keys()].forEach((i) =>
        lot.push(new ParkingSlot(i))
      );

    return lot;
  }, true);
};

exports.parkCar = async (registration_number, timestamp) => {
  return readAndWriteFile((lot) => {
    if (!Car.isValidRegistrationNumber(registration_number))
      return { error: "Invalid Registration Number" };

    if (isCarParked(lot, registration_number))
      return { error: "Vehicle already parked" };

    let index = findEmptySlot(lot);

    if (index === -1) return { error: "Parking Lot is Full" };

    lot[index].parkCar(registration_number, timestamp);

    return { response: index };
  }, true);
};

exports.getCarSlot = async (registration_number) => {
  return readAndWriteFile((lot) => {
    let index = -1;
    for (const slot of lot) {
      const car = slot.getCar();
      if (car && car.getRegistrationNumber() === registration_number) {
        index = slot.getSlotNumber();
        break;
      }
    }

    if (index === -1) return { error: "Vehicle not found" };

    return { response: index };
  });
};

exports.unparkCar = async (slot_number) => {
  return readAndWriteFile((lot) => {
    lot[slot_number].unparkCar();

    return { response: slot_number };
  }, true);
};

exports.getRecentCars = async () => {
  return readAndWriteFile((lot) => {
    return {
      response: lot
        .filter((el) => !el.isEmpty())
        .sort((a, b) => b.getTimestamp() - a.getTimestamp())
        .slice(0, 3)
        .map((el) => ({
          ...el,
          timestamp: new Date(el.timestamp).toLocaleString(),
        })),
    };
  });
};

exports.getAllCars = async () => {
  return readAndWriteFile((lot) => {
    return {
      response: lot
        .filter((el) => !el.isEmpty())
        .map((el) => ({
          ...el,
          timestamp: new Date(el.timestamp).toLocaleString(),
        })),
    };
  });
};
