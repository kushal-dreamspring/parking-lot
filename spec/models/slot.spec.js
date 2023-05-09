const Slot = require("../../models/slot");

describe("Slot Model Suite", function () {
  it("should return slot number", function () {
    const slotNo = 1;
    const s = new Slot(slotNo);
    expect(s.getSlotNumber()).toEqual(slotNo);
  });

  it("should create slots with no car and timestamp", function () {
    const s = new Slot(1);
    expect(s.getTimestamp()).toBeNull();
    expect(s.getCar()).toBeNull();
  });

  it("should park car into slot", function () {
    const s = new Slot(1);
    const registrationNumber = "UP32EA7196";
    const time = Date.now();
    s.parkCar(registrationNumber, time);
    expect(s.getCar().getRegistrationNumber()).toEqual(registrationNumber);
    expect(s.getTimestamp()).toEqual(time);
  });

  it("should unpark car from slot", function () {
    const s = new Slot(1);
    const registrationNumber = "UP32EA7196";
    const time = Date.now();
    s.parkCar(registrationNumber, time);
    s.unparkCar();
    expect(s.getTimestamp()).toBeNull();
    expect(s.getCar()).toBeNull();
  });
});
