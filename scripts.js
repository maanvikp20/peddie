document.getElementById("travel-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const currentLocation = document.getElementById("current-location").value;
  const destination = document.getElementById("destination").value;
  const startDate = document.getElementById("start-date").value;
  const endDate = document.getElementById("end-date").value;

  if (!currentLocation || !destination || !startDate || !endDate) {
    alert("Please fill in all fields.");
    return;
  }

  const formattedDates = `${startDate} to ${endDate}`;

  fetchFlights(currentLocation, destination, formattedDates);
});

function fetchFlights(currentLocation, destination, dates) {
  const apiKey = "f8bc7915cfddc0ff250e0889c07a334d"; // Your actual API key
  const url = `https://api.aviationstack.com/v1/flights?access_key=${apiKey}&origin=${currentLocation}&destination=${destination}&dates=${dates}`;

  document.getElementById("flights").innerHTML =
    "<p>Loading flights data...</p>";

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.data && data.data.length > 0) {
        document.getElementById("flights").innerHTML = ""; // Clear previous content
        data.data.forEach((flight) => {
          const flightBox = document.createElement("div");
          flightBox.className = "flight-box";

          const flightTitle = document.createElement("h3");
          flightTitle.textContent = `Flight to ${destination} on ${flight.flight_date}`;

          const flightDetails = `
            <p><strong>Status:</strong> ${flight.flight_status}</p>
            <p><strong>Departure Airport:</strong> ${
              flight.departure.airport
            } (${flight.departure.iata})</p>
            <p><strong>Scheduled Departure:</strong> ${new Date(
              flight.departure.scheduled
            ).toLocaleString()}</p>
            <p><strong>Estimated Departure:</strong> ${new Date(
              flight.departure.estimated
            ).toLocaleString()}</p>
            <p><strong>Actual Departure:</strong> ${new Date(
              flight.departure.actual
            ).toLocaleString()}</p>
            <p><strong>Estimated Runway:</strong> ${new Date(
              flight.departure.estimated_runway
            ).toLocaleString()}</p>
            <p><strong>Actual Runway:</strong> ${new Date(
              flight.departure.actual_runway
            ).toLocaleString()}</p>
          `;

          flightBox.innerHTML = flightTitle.outerHTML + flightDetails;
          document.getElementById("flights").appendChild(flightBox);
        });
      } else {
        document.getElementById("flights").innerHTML =
          "<p>No flights found for the selected dates.</p>";
      }
    })
    .catch((error) => {
      document.getElementById("flights").innerHTML =
        "<p>Error fetching flight data.</p>";
      console.error("Error fetching flight data:", error);
    });
}
