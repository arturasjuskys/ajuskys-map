import Running from "./assets/js/Running.js";
import Cycling from "./assets/js/Cycling.js";

const form = document.querySelector(".form");
const locationsEl = document.querySelector(".locations");
const workoutTypeEl = document.querySelector(".input-type");
const distanceEl = document.querySelector('input[name="distance"]');
const durationEl = document.querySelector('input[name="duration"]');
const cadenceEl = document.querySelector('input[name="cadence"]');
const elevationEl = document.querySelector('input[name="elevation"]');

class App {
  // private class properties
  #map;
  #mapZoomLevel = 13;
  #mapEvent;
  #workouts = [];

  constructor() {
    // constructure is executed right adfter new object is created with 'new' and all the code in side it can act as init()

    // Get user's position
    // this._workouts = [];
    this._getPosition();

    // Get data from local storage
    this._getLocalStorage();

    // Attach event handlers
    form.addEventListener("submit", this._newWorkout.bind(this));
    workoutTypeEl.addEventListener("change", this._toggleElevationField);
    locationsEl.addEventListener("click", this._moveToPopup.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("Could not get your location");
        }
      );
  }

  _loadMap(position) {
    const { longitude, latitude } = position.coords;
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

    const coords = [latitude, longitude];

    // .setView([latitude, longitude], zoom)
    this.#map = L.map("map").setView(coords, this.#mapZoomLevel);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Handling clicks on map
    this.#map.on("click", this._showForm.bind(this));

    // Rendering workouts on the map
    this.#workouts.forEach(work => {
      this._renderWorkoutMarker(work);
    });
  }

  _showForm(mapE) {
    // mapE => map event
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    // auto-select distance input field
    distanceEl.focus();
  }

  _hideForm() {
    // clear inputs
    distanceEl.value =
      durationEl.value =
      cadenceEl.value =
      elevationEl.value =
        "";

    // fix animation on new click, where animation pulls down on workout elements
    form.style.display = "none";
    form.classList.add("hidden");
    setTimeout(() => (form.style.display = "grid"), 1000); // this will set animation back to default after 1s
  }

  _toggleElevationField() {
    elevationEl.closest(".row").classList.toggle("row-hidden");
    cadenceEl.closest(".row").classList.toggle("row-hidden");
  }

  _newWorkout(e) {
    const validInputs = (...inputs) =>
      inputs.every(item => Number.isFinite(item));
    const allPositive = (...inputs) => inputs.every(item => item > 0);

    e.preventDefault();

    // accessing form data
    const type = workoutTypeEl.value;
    const distance = Number(distanceEl.value);
    const duration = +durationEl.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // creating new Running object
    if (type === "running") {
      const cadence = +cadenceEl.value;

      // validating input data
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert("Input have to be a positive number!");

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // creating Cycling object
    if (type === "cycling") {
      const elevation = +elevationEl.value;

      // validating input data
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert("Input have to be a positive number!");

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    this.#workouts.push(workout); // Add new object to workout array
    this._renderWorkoutMarker(workout); // Render workout on map as marker
    this._renderWorkout(workout); // Render workout on list
    this._hideForm(); // Hide form + clear input fields
    this._setLocalStorage(); // Set local storage to all workouts
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"} ${workout.description}`
      )
      .openPopup();
  }

  _renderWorkout(workout) {
    let html = `
      <li class="location ${workout.type}" data-id="${workout.id}">
        <h2 class="title">${workout.description}</h2>
        <div class="wrapper">
          <div class="details">
            <span class="icon type">${
              workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"
            }</span>
            <span class="value">${workout.distance}</span>
            <span>km</span>
          </div>
          <div class="details">
            <span class="icon">⏱</span>
            <span class="value">${workout.duration}</span>
            <span class="unit">min</span>
          </div>
    `;
    if (workout.type === "running")
      html += `
          <div class="details">
            <span class="icon">⚡️</span>
            <span class="value">${workout.pace.toFixed(1)}</span>
            <span class="unit">min/km</span>
          </div>
          <div class="details">
            <span class="icon">🦶🏼</span>
            <span class="value">${workout.cadence}</span>
            <span class="unit">spm</span>
          </div>
        </div>
      </li>
    `;
    if (workout.type === "cycling")
      html += `
          <div class="details">
            <span class="icon">⚡️</span>
            <span class="value">${workout.speed.toFixed(1)}</span>
            <span class="unit">min/km</span>
          </div>
          <div class="details">
            <span class="icon">⛰</span>
            <span class="value">${workout.elevationGain}</span>
            <span class="unit">spm</span>
          </div>
        </div>
      </li>
    `;

    form.insertAdjacentHTML("afterend", html);
  }

  _moveToPopup(e) {
    const workoutEl = e.target.closest(".location");

    // Guard clows, for null value of clicking outside workout element
    if (!workoutEl) return;

    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );
    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });

    // Using public interface
    // workout.click();
    // Local Storage Disadvantage - because in local storage objects are converted into strings and then we convert them back into objects, they loose prototype chian, it can be resored manually, by when restoring them use appropriete classes
  }

  _setLocalStorage() {
    localStorage.setItem("workouts", JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("workouts"));

    if (!data) return;

    this.#workouts = data;
    this.#workouts.forEach(work => {
      this._renderWorkout(work);
    });
  }

  reset() {
    localStorage.removeItem("workouts"); // deleting local storage
    location.reload(); // reload page => app.reset()
  }
}

const app = new App();
