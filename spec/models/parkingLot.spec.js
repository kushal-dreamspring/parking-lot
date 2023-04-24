const ParkingLot = require("../../models/parkingLot");

describe("Parking Lot Model Suite", function () {
  let lot = null;
  beforeEach(function () {
    lot = new ParkingLot();
  });
  it("should create a list of 10 empty slots", function () {
    expect(lot.lot.length).toEqual(10);
    expect(lot.lot[0].constructor.name).toEqual("Slot");
  });

  it("should park car", function () {
    const index = 0;
    const registration_number = "UP32EA7196";
    const timestamp = Date.now();

    lot.parkCar(index, registration_number, timestamp);

    expect(lot.lot[index].getCar().getRegistrationNumber()).toEqual(
      registration_number
    );
    expect(lot.lot[index].getTimestamp()).toEqual(timestamp);
  });

  it("should find slot of parked car", function () {
    const index = 0;
    const registration_number = "UP32EA7196";
    const timestamp = Date.now();

    lot.parkCar(index, registration_number, timestamp);

    expect(lot.findCarSlot(registration_number)).toEqual(index);
  });

  it("should unpark car", function () {
    const index = 0;
    const registration_number = "UP32EA7196";
    const timestamp = Date.now();

    lot.parkCar(index, registration_number, timestamp);
    lot.unparkCar(index);

    expect(lot.lot[index].isEmpty()).toBeTrue();
  });

  it("should return all cars", function () {
    const timestamp = Date.now();
    for (let i = 0; i < 6; i++)
      lot.parkCar(
        lot.findEmptySlot(),
        "ab12cd123" + i.toString(),
        timestamp + i * 1000
      );
    const allCars = lot.getAllCars();

    expect(allCars.length).toEqual(6);
    expect(allCars[0].car.getRegistrationNumber()).toEqual('ab12cd1230');
    expect(allCars[1].car.getRegistrationNumber()).toEqual('ab12cd1231');
    expect(allCars[2].car.getRegistrationNumber()).toEqual('ab12cd1232');
    expect(allCars[3].car.getRegistrationNumber()).toEqual('ab12cd1233');
    expect(allCars[4].car.getRegistrationNumber()).toEqual('ab12cd1234');
    expect(allCars[5].car.getRegistrationNumber()).toEqual('ab12cd1235');
  });

  it("should return 3 recently parked cars", function () {
    const timestamp = Date.now();
    for (let i = 0; i < 6; i++)
      lot.parkCar(
        lot.findEmptySlot(),
        "ab12cd123" + i.toString(),
        timestamp + i * 1000
      );
    const recentCars = lot.getRecentCars();

    expect(recentCars.length).toEqual(3);
    expect(recentCars[0].car.getRegistrationNumber()).toEqual('ab12cd1235');
    expect(recentCars[1].car.getRegistrationNumber()).toEqual('ab12cd1234');
    expect(recentCars[2].car.getRegistrationNumber()).toEqual('ab12cd1233');
  });
});
