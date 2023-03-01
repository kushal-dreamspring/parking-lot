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
      if (res.error) alert(res.error);
      else alert("Car Parked at " + res.response);
    })
    .catch((err) => console.log(err));
}

function unpark_car(event) {
  event.preventDefault();
  const registration_number = event.target[0].value;

  fetch("/unpark", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      registration_number,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) alert(res.error);
      else alert("Car Unparked from " + res.response);
    })
    .catch((err) => console.log(err));
}
