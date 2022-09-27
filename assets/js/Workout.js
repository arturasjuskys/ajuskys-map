export default class Workout {
  date = new Date();
  id = String(Date.now()).slice(-10);
  clicks = 0;

  constructor(coords, distance, duration) {
    // this.date = date;
    // this.id = id;
    this.coords = coords; // [lat,lng]
    this.distance = distance; // km
    this.duration = duration; // min
  }

  // _ => indicates private values
  _setDescription() {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }

  click() {
    this.clicks++;
  }
}
