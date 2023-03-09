class Car {
  constructor(registration_number) {
    this.registration_number = registration_number;
  }

  static isValidRegistrationNumber(registration_number) {
    const regex = /^[A-Za-z]{2}\w{8}$/;
    return regex.test(registration_number);
  }

  getRegistrationNumber() {
    return this.registration_number;
  }
}

module.exports = Car;
