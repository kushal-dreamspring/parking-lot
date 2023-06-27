const Car = require("../../models/car");

describe("Car Model Suite", function () {
  it("should validate registration number", function () {
    expect(Car.isValidRegistrationNumber("UP32EA719")).toBeFalse();
    expect(Car.isValidRegistrationNumber("1232EA7199")).toBeFalse();
    expect(Car.isValidRegistrationNumber("UP32_EA_71")).toBeFalse();
    expect(Car.isValidRegistrationNumber("UP32EA7196")).toBeTrue();
  });

  it("should return registration number of car", function () {
    const registrationNumber = "UP32EA7196";
    const car = new Car(registrationNumber);
    expect(car.getRegistrationNumber()).toEqual(registrationNumber);
  });
});
