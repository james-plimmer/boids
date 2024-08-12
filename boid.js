class Boid {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.maxForce = 0.2;
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

  alignOrCohere(flock, mode) {
    let perceptionRadius = 100;
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
    let alignment = this.alignOrCohere(boids, 'align');
    let cohesion = this.alignOrCohere(boids, 'cohere');
    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0); // reset acceleration before next update (preventing accumulation)
  }

  show() {
    stroke(255);
    strokeWeight(8);
    point(this.position.x, this.position.y);
  }
}
