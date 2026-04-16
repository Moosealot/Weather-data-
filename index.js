// index.js
// const weatherApi = "https://api.weather.gov/alerts/active?area="

document.addEventListener("DOMContentLoaded", () => {

const input = document.getElementById("state-input");
const button = document.getElementById("get-alerts");
const alertsContainer = document.getElementById("alerts-display");
const errorDiv = document.getElementById("error-message");
const loadingDiv = document.getElementById("loading");

function fetchWeatherAlerts(state) {

    loadingDiv.classList.remove("hidden");

    fetch(`https://api.weather.gov/alerts/active?area=${state}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Invalid state code or API error");
            }
            return response.json();
        })
        .then(data => {
            console.log(data);

            displayAlerts(data, state);

            errorDiv.textContent = "";
            errorDiv.classList.add("hidden");
        })
        .catch(error => {
            console.log(error.message);

            errorDiv.textContent = error.message;
            errorDiv.classList.remove("hidden");
        })
        .finally(() => {
            loadingDiv.classList.add("hidden");
        });
}

function displayAlerts(data, state) {

    alertsContainer.innerHTML = "";

    const alerts = data.features;

    const summary = document.createElement("h2");
    summary.textContent = `Weather Alerts: ${alerts.length}`;    alertsContainer.appendChild(summary);
    const list = document.createElement("ul");

    alerts.forEach(alert => {
        const li = document.createElement("li");
        li.textContent = alert.properties.headline;
        list.appendChild(li);
    });

    alertsContainer.appendChild(list);
}


button.addEventListener("click", () => {

    const state = input.value.trim().toUpperCase();


    alertsContainer.innerHTML = "";
    errorDiv.textContent = "";
    errorDiv.classList.add("hidden");


    if (!state) {
        errorDiv.textContent = "Please enter a state code.";
        errorDiv.classList.remove("hidden");
        return;
    }

    if (!/^[A-Z]{2}$/.test(state)) {
        errorDiv.textContent = "State code must be two capital letters.";
        errorDiv.classList.remove("hidden");
        return;
    }

    fetchWeatherAlerts(state);

    input.value = "";
});

});
