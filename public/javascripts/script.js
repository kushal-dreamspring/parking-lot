const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

function park_car(event) {
  event.preventDefault();
  const registration_number = event.target[0].value;

  fetch("/park", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      registration_number,
      timestamp: Date.now(),
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) alert(res.error, "danger");
      else
        alert(
          `
            <h4 class="alert-heading">Car Parked!</h4>
            <p>Your Car has been parked at Slot <strong id="slot" class="text-success">${res.response}</strong></p>
            `,
          "success"
        );
    })
    .catch((err) => console.log(err))
    .finally(() => {
      event.target[0].value = "";
    });
}

function get_car_slot(event) {
  event.preventDefault();
  const registration_number = event.target[0].value;

  fetch(`/car-slot?registration_number=${registration_number}`)
    .then((res) => res.json())
    .then((res) => {
      if (res.error) alert(res.error, "danger");
      else {
        alert(
          `
            <h4 class="alert-heading">Car Found!</h4>
            <p>Your Car is Parked at Slot <strong id="slot" class="text-success">${res.response}</strong></p>
            <hr>
            <button type="button" class="btn btn-success" onclick="unpark_car(${res.response})">Unpark Car</button>
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

function unpark_car(slot_number) {
  fetch("/unpark", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      slot_number,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) alert(res.error, "danger");
      else {
        alert(
          `
            <h4 class="alert-heading">Car Unparked!</h4>
            <p>Your Car is unparked from Slot <strong id="slot" class="text-success">${res.response}</strong></p>
          `,
          "success"
        );
      }
    })
    .catch((err) => console.log(err));
}

function get_recent_cars() {
  fetch("/recent-cars")
    .then((res) => res.json())
    .then((response) => {
      const tbody = document.getElementById("recent-cars-table").children[1];
      tbody.innerHTML = "";

      for (let slot of response.response) {
        const date = new Date(slot.timestamp);
        slot.timestamp = Intl.DateTimeFormat("en-US", {
          timeZone,
          dateStyle: "medium",
          timeStyle: "medium",
        }).format(date);

        tbody.innerHTML += `<tr>
          <td>${slot.car.registration_number}</td>
          <td>${slot.slot_no}</td>
          <td>${slot.timestamp}</td>
        </tr>`;
      }
    });
}

function get_all_cars() {
  fetch("/all-cars")
    .then((res) => res.json())
    .then((response) => {
      const tbody = document.getElementById("all-cars-table").children[1];
      tbody.innerHTML = "";

      for (let slot of response.response) {
        const date = new Date(slot.timestamp);
        slot.timestamp = Intl.DateTimeFormat("en-US", {
          timeZone,
          dateStyle: "medium",
          timeStyle: "medium",
        }).format(date);

        tbody.innerHTML += `<tr>
          <td>${slot.car.registration_number}</td>
          <td>${slot.slot_no}</td>
          <td>${slot.timestamp}</td>
        </tr>`;
      }
    });
}

const alert = (message, type) => {
  const alertPlaceholder = document.getElementById("liveAlertPlaceholder");

  alertPlaceholder.innerHTML = `<div class="alert alert-${type} alert-dismissible" role="alert">
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
};
