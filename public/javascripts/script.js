const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

function parkCar(event) {
  event.preventDefault();
  const alertPlaceholder = document.getElementById("parkAlertPlaceholder");
  const registrationNumber = event.target[0].value;

  fetch("/park", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      registrationNumber,
      timestamp: Date.now(),
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) alert(alertPlaceholder, res.error, "danger");
      else
        alert(
          alertPlaceholder,
          `
            <h4 class="alert-heading">Car Parked!</h4>
            <p>Your Car ${registrationNumber} has been parked at Slot <strong id="slot" class="text-success">${res.response}</strong></p>
            `,
          "success"
        );
    })
    .catch((err) => console.log(err))
    .finally(() => {
      event.target[0].value = "";
    });
}

function getCarSlot(event) {
  event.preventDefault();
  const alertPlaceholder = document.getElementById("findAlertPlaceholder");
  const registrationNumber = event.target[0].value;

  fetch(`/car-slot?registrationNumber=${registrationNumber}`)
    .then((res) => res.json())
    .then((res) => {
      if (res.error) alert(alertPlaceholder, res.error, "danger");
      else {
        alert(
          alertPlaceholder,
          `
            <h4 class="alert-heading">Car Found!</h4>
            <p>Your Car ${registrationNumber} is Parked at Slot <strong id="slot" class="text-success">${res.response}</strong></p>
            <hr>
            <button type="button" class="btn btn-success" onclick="unparkCar(${res.response})">Unpark Car</button>
          `,
          "success"
        );
      }
    })
    .catch((err) => console.log(err))
    .finally(() => {
      event.target[0].value = "";
    });
}

function unparkCar(slotNumber) {
  const alertPlaceholder = document.getElementById("findAlertPlaceholder");
  const registrationNumber = document.querySelectorAll('#registrationNumber')[1].value;

  fetch("/unpark", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      slotNumber,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) alert(alertPlaceholder, res.error, "danger");
      else {
        alert(
          alertPlaceholder,
          `
            <h4 class="alert-heading">Car Unparked!</h4>
            <p>Your Car ${registrationNumber} is unparked from Slot <strong id="slot" class="text-success">${res.response}</strong></p>
          `,
          "success"
        );
      }
    })
    .catch((err) => console.log(err));
}

function getRecentCars() {
  fetch("/recent-cars")
    .then((res) => res.json())
    .then((response) => {
      displayTable(
        document.getElementById("recent-cars-table").children[1],
        response
      );
    });
}

function getAllCars() {
  fetch("/all-cars")
    .then((res) => res.json())
    .then((response) => {
      displayTable(
        document.getElementById("all-cars-table").children[1],
        response
      );
    });
}

function displayTable(tbody, response) {
  tbody.innerHTML = "";

  for (let slot of response.response) {
    const date = new Date(slot.timestamp);
    slot.timestamp = Intl.DateTimeFormat("en-US", {
      timeZone,
      dateStyle: "medium",
      timeStyle: "medium",
    }).format(date);

    tbody.innerHTML += `<tr>
          <td>${slot.car.registrationNumber}</td>
          <td>${slot.slotNo}</td>
          <td>${slot.timestamp}</td>
        </tr>`;
  }
}

const alert = (alertPlaceholder, message, type) => {
  alertPlaceholder.innerHTML = `<div class="alert alert-${type} alert-dismissible" role="alert">
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
};
