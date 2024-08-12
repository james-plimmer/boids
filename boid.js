class Boid {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.maxForce = 0.2;
    this.maxSpeed = 2;
  }

  edges() {
    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width;
    }

    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height;
    }
  }

  align(flock) {
    let perceptionRadius = 50;
    let steeringForce = createVector();
    let boidsInRadius = 0;
    for (let other of flock) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && d < perceptionRadius) {
        steeringForce.add(other.velocity);
        boidsInRadius++;
      }
    }

    if (boidsInRadius > 0) {
      steeringForce.div(boidsInRadius);
      steeringForce.sub(this.velocity);
      steeringForce.limit(this.maxForce);
      steeringForce.setMag(this.maxSpeed);
    }

    return steeringForce;
  }

  flock(boids) {
    let alignment = this.align(boids);
    this.acceleration = alignment;
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
  }

  show() {
    stroke(255);
    strokeWeight(8);
    point(this.position.x, this.position.y);
  }
}
