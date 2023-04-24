const Slot = require("../../models/slot");

describe("Slot Model Suite", function () {
  it("should return slot number", function () {
    const slot__no = 1;
    const s = new Slot(slot__no);
    expect(s.getSlotNumber()).toEqual(slot__no);
  });

  it("should create slots with no car and timestamp", function () {
    const s = new Slot(1);
    expect(s.getTimestamp()).toBeNull();
    expect(s.getCar()).toBeNull();
  });

  it("should park car into slot", function () {
    const s = new Slot(1);
    const registration_number = "UP32EA7196";
    const time = Date.now();
    s.parkCar(registration_number, time);
    expect(s.getCar().getRegistrationNumber()).toEqual(registration_number);
    expect(s.getTimestamp()).toEqual(time);
  });

  it("should unpark car from slot", function () {
    const s = new Slot(1);
    const registration_number = "UP32EA7196";
    const time = Date.now();
    s.parkCar(registration_number, time);
    s.unparkCar();
    expect(s.getTimestamp()).toBeNull();
    expect(s.getCar()).toBeNull();
  });
});
