// sketch.js

// Déclaration des variables globales
let vehicles = [];
let maxSpeedSlider;
let rayonZoneDeFreinageSlider;

// Configuration initiale de la toile
function setup() {
  createCanvas(windowWidth, windowHeight);

  // Création des curseurs (sliders)
  maxSpeedSlider = createSlider(0, 20, 10); // min, max, default
  rayonZoneDeFreinageSlider = createSlider(0, 200, 100); // min, max, default

  // Initialisation de la liste de véhicules
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

// Fonction appelée en boucle pour dessiner les éléments
function draw() {
  background(0);

  // Mise à jour des paramètres basée sur les valeurs des curseurs
  for (let i = 0; i < vehicles.length; i++) {
    vehicles[i].maxSpeed = maxSpeedSlider.value();
    vehicles[i].rayonZoneDeFreinage = rayonZoneDeFreinageSlider.value();
  }

  // Boucle à travers tous les véhicules pour les mettre à jour, les afficher, et appliquer les forces appropriées
  for (let i = 0; i < vehicles.length; i++) {
    if (i === 0) {
      // Déplacement du leader vers la position de la souris
      let target = createVector(mouseX, mouseY);
      let s = vehicles[i].arrive(target);
      vehicles[i].applyForce(s);
    } else {
      // Déplacement des suiveurs vers la position du leader précédent
      let leader = vehicles[i - 1]; // Le suiveur précédent est maintenant le leader
      let s = vehicles[i].arrive(leader.pos);
      vehicles[i].applyForce(s);
    }

    // Mise à jour, affichage des véhicules
    vehicles[i].update();
    vehicles[i].show();
  }
}

// Fonction appelée lorsque la souris est cliquée
function mousePressed() {
  // Création d'un nouveau véhicule à la position de la souris
  let v = new Vehicle(random(width), random(height));
  v.maxSpeed = maxSpeedSlider.value();
  v.rayonZoneDeFreinage = rayonZoneDeFreinageSlider.value();
  vehicles.push(v);
}
