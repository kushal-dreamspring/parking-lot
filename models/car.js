class Car {
  constructor(registrationNumber) {
    this.registrationNumber = registrationNumber;
  }

  static isValidRegistrationNumber(registrationNumber) {
    const regex = /^[A-Za-z]{2}[a-zA-Z0-9]{8}$/;
    return regex.test(registrationNumber);
  }

  getRegistrationNumber() {
    return this.registrationNumber;
  }
}

module.exports = Car;
