# Map Workouts

[Access app here...](https://ajuskys-map.netlify.app/)

## Description

Mark places on the map where you workout, scroll through a list of your running and cycling bookmarks that will focus the map to selected session.

### DESIGN

One page application developed using HTML, CSS and Leaflet open-source interactive maps. Interactivity with the app is controlled by JavaScript and Document Object Model (DOM).

JavaScript code is split between 4 class files, 3 of which are located in /assets/js.

### LOGIC

This app is an example of Object Oriented Programming (OOP) in JavaScript. Whole application is split into four classes to provide full functionality and interactivity with the page.

Workout is the main class template that defines workout description, and holds geolocation info. Cycling and Running classes extend Workout class to add additional functionality to workout objects without repeating Workout class functionality code.

App class encompases whole application logic including creation of Running and Cycling objects. Most of the methods belonging to the App class are \_privateMethods, except one public reset() method to clear local storage if needed.

<!-- ### The Complete JavaScript Course 2021: From Zero to Expert! | [Udemy.com](https://www.udemy.com/course/the-complete-javascript-course/) -->

<!-- * `Purchased Course`: 24.09.2020 -->
<!-- * `Finished this Project`: 20.12.2020 03:48 -->

## Resources

- HTML
- CSS: Flexbox
- JavaScript: Classes, DOM
- Leaflet: [open-source maps](https://leafletjs.com/)
- Google Fonts: [Manrope](https://fonts.google.com/specimen/Manrope?query=Manrope)

![](./assets/740%20-%20Map%20App.jpg)
![](./assets/741%20-%20Map%20App.jpg)
