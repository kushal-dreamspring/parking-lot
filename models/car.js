class Car {
  constructor(registration_number) {
    this.registration_number = registration_number;
  }

  static isValidRegistrationNumber(registration_number) {
    const regex = /\w{2}(\w|\d){8}$/;
    return regex.test(registration_number);
  }

  getRegistrationNumber() {
    return this.registration_number;
  }
}

module.exports = Car;
