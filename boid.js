class Boid {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.maxForce = 0.6;
    this.maxSpeed = 4;
  }

  // wrap around edges of canvas
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

  ACS(flock, mode) {
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
        boidsInRadius++;
        if (mode === 'align') {
          // find average velocity to move flock in same direction
          steeringForce.add(other.velocity);
        }
        if (mode === 'cohere') {
          // find average position to make boids travel towards center of flock
          steeringForce.add(other.position);
        }
        if (mode === 'separate') {
          // find average position to make boids travel away from each other
          let diff = p5.Vector.sub(this.position, other.position);
          diff.div(d); // weight by inverse of distance
          steeringForce.add(diff);
        }
      }
    }

    if (boidsInRadius > 0) {
      steeringForce.div(boidsInRadius); // divide to get average
      if (mode === 'cohere') {
        steeringForce.sub(this.position); // subtract current position to get vector pointing towards average position
      }
      steeringForce.setMag(this.maxSpeed);
      steeringForce.sub(this.velocity); // subtract current velocity to get steering force needed to correct current velocity
      steeringForce.limit(this.maxForce);
    }

    return steeringForce;
  }

  flock(boids) {
    let alignment = this.ACS(boids, 'align');
    let cohesion = this.ACS(boids, 'cohere');
    let separation = this.ACS(boids, 'separate');
    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0); // reset acceleration before next update (preventing accumulation)
  }

  show() {
    let theta = this.velocity.heading() + radians(90); // Offset by 90 degrees to point the triangle's tip forward
    fill(127);
    stroke(200);
    push();
    translate(this.position.x, this.position.y);
    rotate(theta);
    beginShape();
    vertex(0, -20);
    vertex(-10, 10);
    vertex(10, 10);
    endShape(CLOSE);
    pop();
  }
}
