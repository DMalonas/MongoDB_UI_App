class Bunny {
  constructor(x, y, scale) {
    this.x = x;
    this.y = y;
    this.scale = scale;
    this.vx = random(0.3, 1) * (random() > 0.5 ? 1 : -1);
    this.petTimer = 0;
    this.color = "white";
    this.hunger = 0;

    this.earWiggleTimer = 0;
    this.earWiggleAngle = 0;

    this.alpha = 255;
    this.fadingOut = false;
    this.hoverTime = 0;
    this.lastFed = 0;
    this.isClicked = false;

  }




update() {
  let speed = this.hunger > 4 ? this.vx * 2 : this.vx;
  this.x += speed;
  if (this.x > width + 50) this.x = -50;
  if (this.x < -50) this.x = width + 50;

  if (dist(mouseX, mouseY, this.x, this.y) < 40) {
    this.petTimer = 5;
    this.earWiggleTimer = 15;
  }

  if (this.petTimer > 0) this.petTimer--;

  if (this.earWiggleTimer > 0) {
    this.earWiggleTimer--;
    let t = map(this.earWiggleTimer, 0, 15, 0, 1);
    this.earWiggleAngle = sin(frameCount * 0.15) * 0.3 * t;
  } else {
    this.earWiggleAngle *= 0.8;
    if (abs(this.earWiggleAngle) < 0.01) this.earWiggleAngle = 0;
  }

  if (this.fadingOut) {
    this.alpha -= 8;
    if (this.alpha < 0) this.alpha = 0;
  }

  // 🥕 Feed-point logic (hover + click for 6 seconds)
  const isHovering = dist(mouseX, mouseY, this.x, this.y) < 40;
  if (isHovering && this.isClicked) {
    this.hoverTime = (this.hoverTime || 0) + deltaTime;
    this.lastFed = this.lastFed || 0;

    if (this.hoverTime - this.lastFed >= 1000) {
      this.hunger = Math.max(0, this.hunger - 1);
      this.lastFed = this.hoverTime;
      console.log(`${this.name} fed! Hunger now: ${this.hunger}`);

      // 🔁 Persist to MongoDB
      if (!this._id) {
        console.warn("Missing _id for bunny:", this.name);
      } else {
        console.log("Sending update for", this.name, "with _id:", this._id);
        fetch('http://localhost:3000/bunnies/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filter: { _id: this._id },
            update: { $set: { hunger: this.hunger } }
          })
        })
        .then(res => res.json())
        .then(data => console.log("Update response:", data))
        .catch(err => console.error("Update fetch error:", err));
      }

    }

  } else {
    this.hoverTime = 0;
  }
}


display() {
  push();
  translate(this.x, this.y);
  scale(this.scale);
  noStroke();

  const pastelMap = {
    white: [255, 255, 255],
    icy_blue: [230, 245, 255],
    blus_peach: [255, 235, 220],
    pink: [255, 220, 235],
    lilac: [235, 230, 250],
    cream: [255, 250, 240]
  };
  const pastel = pastelMap[this.color] || [240, 240, 240];

  // Body
  fill(...pastel, this.alpha);
  ellipse(0, 0, 30, 40);

  // Outer ears
  fill(...pastel, this.alpha);
  this.drawEar(-7, -30, this.earWiggleAngle);
  this.drawEar(7, -30, -this.earWiggleAngle);

  // Inner ears
  fill(255, 192, 203, this.alpha);
  this.drawInnerEar(-7, -30, this.earWiggleAngle);
  this.drawInnerEar(7, -30, -this.earWiggleAngle);

  // Face
  if (this.petTimer > 0) {
    stroke(50, 50, 255, this.alpha);
    strokeWeight(2);
    line(-6, -5, -4, -5);
    line(6, -5, 4, -5);
    noStroke();
    fill(255, 100, 150, this.alpha);
    ellipse(-10, 2, 6, 4);
    ellipse(10, 2, 6, 4);
  } else {
    noStroke();
    fill(30, 50, 200, this.alpha);
    ellipse(-5, -5, 4);
    ellipse(5, -5, 4);
  }

  // 🥕 Feeding feedback: glow or heart if just fed
  if (this.hoverTime && this.hoverTime - this.lastFed < 3000) {
    fill(255, 100, 150, this.alpha); // soft pink heart
    textSize(20);
    textAlign(CENTER);
    text("❤️", 0, -50); // floating above the bunny
  }

  pop();
}


  drawEar(x, y, angle) {
    push();
    translate(x, y);
    rotate(angle);
    ellipse(0, 0, 10, 30);
    pop();
  }

  drawInnerEar(x, y, angle) {
    push();
    translate(x, y);
    rotate(angle);
    ellipse(0, 0, 4, 18);
    pop();
  }

  applyDocument(doc) {
    for (const [key, value] of Object.entries(doc)) {
      if (key !== '_id') { // Skip MongoDB ID
        this[key] = value;
      }
    }
  }
}
