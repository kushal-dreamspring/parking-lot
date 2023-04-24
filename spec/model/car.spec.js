const Car = require("../../models/car");

describe("Car Model Suite", function () {
  it("should validate registration number", function () {
    expect(Car.isValidRegistrationNumber("UP32EA719")).toBeFalse();
    expect(Car.isValidRegistrationNumber("1232EA7199")).toBeFalse();
    expect(Car.isValidRegistrationNumber("UP32_EA_71")).toBeFalse();
    expect(Car.isValidRegistrationNumber("UP32EA7196")).toBeTrue();
  });

  it("should return registration number of car", function () {
    const registration_number = "UP32EA7196";
    const c = new Car(registration_number);
    expect(c.getRegistrationNumber()).toEqual(registration_number);
  });
});
