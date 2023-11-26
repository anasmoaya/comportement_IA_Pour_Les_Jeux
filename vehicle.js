
// La classe Vehicle représente un véhicule dans le système.
class Vehicle {
  // Le constructeur initialise les propriétés du véhicule.
  constructor(x, y) {
    this.pos = createVector(x, y); // Position du véhicule.
    this.vel = createVector(0, 0); // Vecteur vitesse du véhicule.
    this.acc = createVector(0, 0); // Vecteur accélération du véhicule.
    this.maxSpeed = 20; // Vitesse maximale du véhicule.
    this.maxForce = 0.4; // Force maximale appliquée au véhicule.
    this.r = 16; // Rayon du véhicule.
    this.rayonZoneDeFreinage = 100; // Rayon de la zone de freinage pour le véhicule.
    this.isLeader = false; // Nouvelle propriété pour déterminer si le véhicule est un leader.
  }

  // La méthode evade renvoie une force d'évasion par rapport à un autre véhicule.
  evade(vehicle) {
    let pursuit = this.pursue(vehicle);
    pursuit.mult(-1);
    return pursuit;
  }

  // La méthode pursue génère une force de poursuite par rapport à un autre véhicule.
  pursue(vehicle) {
    let target = vehicle.pos.copy();
    let prediction = vehicle.vel.copy();
    prediction.mult(10);
    target.add(prediction);
    fill(0, 255, 0);
    circle(target.x, target.y, 16);
    return this.seek(target);
  }

  // La méthode arrive génère une force pour atteindre une cible.
  arrive(target) {
    let force;
    if (this.isLeader) {
      force = p5.Vector.sub(target, this.pos);
    } else {
      force = p5.Vector.sub(target, this.pos);
      let distance = p5.Vector.dist(this.pos, target);
      if (distance < this.rayonZoneDeFreinage * 2) {
        // Si le véhicule est trop proche du leader, ralentissez plus tôt.
        let mappedSpeed = map(distance, 0, this.rayonZoneDeFreinage * 2, 0, this.maxSpeed);
        force.setMag(mappedSpeed);
      } else {
        force.setMag(this.maxSpeed);
      }
    }

    force.sub(this.vel);
    force.limit(this.maxForce);
    return force;
  }

  // La méthode flee génère une force de fuite par rapport à une cible.
  flee(target) {
    return this.seek(target).mult(-1);
  }

  // La méthode seek génère une force pour atteindre une cible, avec une option d'arrivée.
  seek(target, arrival = false) {
    let force = p5.Vector.sub(target, this.pos);
    let desiredSpeed = this.maxSpeed;

    if (arrival) {
      let rayon = this.rayonZoneDeFreinage;
      noFill();
      stroke("white");
      circle(this.pos.x, this.pos.y, rayon);

      let distance = p5.Vector.dist(this.pos, target);

      if (distance < rayon) {
        desiredSpeed = map(distance, 0, rayon, 0, this.maxSpeed);
      }
    }

    force.setMag(desiredSpeed);
    force.sub(this.vel);
    force.limit(this.maxForce);
    return force;
  }

  // La méthode applyForce ajoute une force au vecteur d'accélération du véhicule.
  applyForce(force) {
    this.acc.add(force);
  }

  // La méthode update met à jour la position, la vitesse et l'accélération du véhicule.
  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  // La méthode showContour affiche le contour du véhicule.
  showContour() {
    noFill();
    stroke(255);
    strokeWeight(1);
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }

  // La méthode show affiche le véhicule avec une forme de triangle orientée dans la direction de la vitesse.
  show() {
    this.showContour();

    stroke(255);
    strokeWeight(2);
    fill(255);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
    pop();
  }

  // La méthode edges gère les bords de l'environnement, faisant rebondir le véhicule s'il atteint un bord.
  edges() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }
}
