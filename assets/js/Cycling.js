import Workout from "./Workout.js";

export default class Cycling extends Workout {
  type = "cycling";

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    // this.type = "cycling";
    this.calcSpped();
    this._setDescription();
  }

  calcSpped() {
    // km/h
    this.speed = this.distance / (this.duration / 60);

    return this.speed;
  }
}
