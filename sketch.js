// sketch.js
let vehicles = [];
let maxSpeedSlider;
let rayonZoneDeFreinageSlider;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create sliders
  maxSpeedSlider = createSlider(0, 20, 10); // min, max, default
  rayonZoneDeFreinageSlider = createSlider(0, 200, 100); // min, max, default

  vehicles = [];
  let n = 3; // Nous avons maintenant un leader et deux suiveurs
  for (let i = 0; i < n; i++) {
    let v = new Vehicle(random(width), random(height));
    v.maxSpeed = maxSpeedSlider.value();
    v.rayonZoneDeFreinage = rayonZoneDeFreinageSlider.value();
    vehicles.push(v);
  }

  // Le premier véhicule (index 0) est le leader
  vehicles[0].isLeader = true;
}

function draw() {
  background(0);

  // Update parameters based on slider values
  for (let i = 0; i < vehicles.length; i++) {
    vehicles[i].maxSpeed = maxSpeedSlider.value();
    vehicles[i].rayonZoneDeFreinage = rayonZoneDeFreinageSlider.value();
  }

  for (let i = 0; i < vehicles.length; i++) {
    if (i === 0) {
      let target = createVector(mouseX, mouseY);
      let s = vehicles[i].arrive(target);
      vehicles[i].applyForce(s);
    } else {
      let leader = vehicles[i - 1]; // Le suiveur précédent est maintenant le leader
      let s = vehicles[i].arrive(leader.pos);
      vehicles[i].applyForce(s);
    }

    vehicles[i].update();
    vehicles[i].show();
  }
}

function mousePressed() {
  // Create a new vehicle at the mouse position
  let v = new Vehicle(random(width), random(height));
  v.maxSpeed = maxSpeedSlider.value();
  v.rayonZoneDeFreinage = rayonZoneDeFreinageSlider.value();
  vehicles.push(v);
}