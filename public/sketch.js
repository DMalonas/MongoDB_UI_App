// sketch.js

let bunnies = [];
let cellPhases = [];
let rainSound; // 👈 1. Create a variable for the sound
const { ObjectId } = require('mongodb');

let dbBunnies = [
  { name: "Clover", age: 2, color: "white", hunger: 3 },
  { name: "Thumper", age: 1, color: "grey", hunger: 5 },
  { name: "Nibbles", age: 4, color: "brown", hunger: 2 }
];


// 2. Preload the sound file to ensure it's ready to play
function preload() {
  // soundFormats('wav');
  // rainSound = loadSound('with_sound_recorder_just_raining.wav');
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let y = 0; y < height; y += 8) {
    let row = [];
    for (let x = 0; x < width; x += 8) {
      row.push(random(TWO_PI));
    }
    cellPhases.push(row);
  }

  loadBunniesFromServer();
  noStroke();

  // 3. Set up the sound button listener
  const soundButton = select('#soundButton');
  soundButton.mousePressed(toggleSound); 
}


// 4. Create a function to toggle the sound
function toggleSound() {
  const soundButton = select('#soundButton');
  if (!rainSound) {
    rainSound = loadSound('with_sound_recorder_just_raining.wav', () => {
      rainSound.loop();
      soundButton.addClass('playing');
    });
    return;
  }

  if (rainSound.isPlaying()) {
    rainSound.pause();
    soundButton.removeClass('playing');
  } else {
    rainSound.loop();
    soundButton.addClass('playing');
  }
}



function draw() {
  //clear(); // 👈 add this line to reset canvas
  backgroundWave();

  for (let bunny of bunnies) {
    // re-render behind fading bunnies too
    let range = 50;
    for (let y = bunny.y - range; y <= bunny.y + range; y += 8) {
      for (let x = bunny.x - range; x <= bunny.x + range; x += 8) {
        if (x < 0 || x >= width || y < 0 || y >= height) continue;

        let xi = Math.floor(x / 8);
        let yi = Math.floor(y / 8);
        let phase = cellPhases[yi]?.[xi];
        if (phase === undefined) continue;

        let t = millis() * 0.0006;
        let baseWave = sin(t + phase);
        let distanceToMouse = dist(mouseX, mouseY, x, y);
        let mouseInfluence = map(distanceToMouse, 0, 160, 3.5, 0, true);
        let z = baseWave + mouseInfluence;
        let scaleFactor = map(z, -1, 4.5, 0.3, 2.2);

        let baseR = 180 + 30 * sin(phase + t * 0.5);
        let baseG = 220 + 25 * sin(phase + t * 0.6);
        let baseB = 255;
        let pinkBoost = map(mouseInfluence, 0, 3.5, 0, 1);
        let r = lerp(baseR, 255, pinkBoost);
        let g = lerp(baseG, 180, pinkBoost);
        let b = baseB;

        fill(r, g, b, 70);
        let size = 4 * scaleFactor;
        ellipse(x, y, size, size);
      }
    }

    bunny.update();
    bunny.display();
  }

  // Remove fully transparent bunnies
  bunnies = bunnies.filter(b => b.alpha > 0 || !b.fadingOut);
}


function draw2() {
  clear(); // 👈 add this line to reset canvas
  backgroundWave();

  for (let bunny of bunnies) {
    // re-render behind fading bunnies too
    let range = 50;
    for (let y = bunny.y - range; y <= bunny.y + range; y += 8) {
      for (let x = bunny.x - range; x <= bunny.x + range; x += 8) {
        if (x < 0 || x >= width || y < 0 || y >= height) continue;

        let xi = Math.floor(x / 8);
        let yi = Math.floor(y / 8);
        let phase = cellPhases[yi]?.[xi];
        if (phase === undefined) continue;

        let t = millis() * 0.0006;
        let baseWave = sin(t + phase);
        let distanceToMouse = dist(mouseX, mouseY, x, y);
        let mouseInfluence = map(distanceToMouse, 0, 160, 3.5, 0, true);
        let z = baseWave + mouseInfluence;
        let scaleFactor = map(z, -1, 4.5, 0.3, 2.2);

        let baseR = 180 + 30 * sin(phase + t * 0.5);
        let baseG = 220 + 25 * sin(phase + t * 0.6);
        let baseB = 255;
        let pinkBoost = map(mouseInfluence, 0, 3.5, 0, 1);
        let r = lerp(baseR, 255, pinkBoost);
        let g = lerp(baseG, 180, pinkBoost);
        let b = baseB;

        fill(r, g, b, 70);
        let size = 4 * scaleFactor;
        ellipse(x, y, size, size);
      }
    }

    bunny.update();
    bunny.display();
  }

  // Remove fully transparent bunnies
  bunnies = bunnies.filter(b => b.alpha > 0 || !b.fadingOut);
}



function backgroundWave() {
  let t = millis() * 0.0006;
  for (let y = 0, yi = 0; y < height; y += 8, yi++) {
    for (let x = 0, xi = 0; x < width; x += 8, xi++) {
      let phase = cellPhases[yi][xi];
      let baseWave = sin(t + phase);

      let distanceToMouse = dist(mouseX, mouseY, x, y);
      let mouseInfluence = map(distanceToMouse, 0, 160, 3.5, 0, true);

      let z = baseWave + mouseInfluence;

      // Dissolve if near a bunny
      let dissolve = 1;
      for (let bunny of bunnies) {
        let distToBunny = dist(bunny.x, bunny.y, x, y);
        if (distToBunny < 50) {
          dissolve = map(distToBunny, 0, 50, 0, 1);
          break;
        }
      }

      let scaleFactor = map(z, -1, 4.5, 0.3, 2.2) * dissolve;

      // Base color: dreamy blue
      let baseR = 180 + 30 * sin(phase + t * 0.5);
      let baseG = 220 + 25 * sin(phase + t * 0.6);
      let baseB = 255;

      // Ripple highlight: pink blend
      let pinkBoost = map(mouseInfluence, 0, 3.5, 0, 1);
      let r = lerp(baseR, 255, pinkBoost);
      let g = lerp(baseG, 180, pinkBoost);
      let b = baseB;

      fill(r, g, b, 70 * dissolve);

      let size = 4 * scaleFactor;
      ellipse(x, y, size, size);
    }
  }
}

// sketch.js (update loadBunniesFromServer)
// sketch.js
function loadBunniesFromServer(query = {}) {
  const params = new URLSearchParams();
  params.append('q', JSON.stringify(query));
  
  fetch(`http://localhost:3000/bunnies?${params}`)
    .then(res => {
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      return res.json();
    })
    .then(data => {
      bunnies = [];
      for (let doc of data) {
        let bunny = new Bunny(
          doc.x ?? random(width),
          doc.y ?? random(60, height),
          doc.scale ?? random(0.8, 1.2)
        );
        
        // Assign all properties
        Object.assign(bunny, doc);
        bunny.applyDocument(doc);

        bunnies.push(bunny);
      }
    })
    .catch(err => {
      console.error("Load error:", err);
    });
}


function runAggregation(pipeline) {
  const params = new URLSearchParams();
  params.append('q', JSON.stringify(pipeline));
  
  fetch(`http://localhost:3000/bunnies?${params}`)
    .then(res => {
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      return res.json();
    })
    .then(results => {
      console.log("Aggregation Results:", results);
      displayAggregationResults(results);
    })
    .catch(err => {
      console.error("Aggregation error:", err);
      alert(`Aggregation Error: ${err.message}`);
    });
}

function displayAggregationResults(results) {
  const resultsDiv = document.getElementById('resultsPanel');
  if (!resultsDiv) return;
  
  resultsDiv.innerHTML = '';
  
  results.forEach(r => {
    const div = document.createElement('div');
    div.className = 'result-item';
    
    // Handle grouped results with null _id
    if (r._id === null) {
      const entries = Object.entries(r).filter(([key]) => key !== '_id');
      if (entries.length === 1) {
        // For single-field results: "Total Hunger: 55"
        div.textContent = `${entries[0][0]}: ${entries[0][1]}`;
      } else {
        // For multi-field results: "Total: Hunger: 55, Count: 10"
        const content = entries.map(([key, value]) => `${key}: ${value}`).join(', ');
        div.textContent = content;
      }
    }
    // Handle documents without _id (projections)
    else if (r._id === undefined) {
      const content = Object.entries(r).map(([key, value]) => {
        if (value && typeof value === 'object') {
          return `${key}: ${JSON.stringify(value)}`;
        }
        return `${key}: ${value}`;
      }).join(', ');
      div.textContent = content;
    }
    // Handle grouped results with _id
    else {
      const idValue = typeof r._id === 'object'
        ? JSON.stringify(r._id)
        : String(r._id).slice(0, 5); // show only first 5 characters

      const entries = Object.entries(r).filter(([key]) => key !== '_id');
      const content = entries.map(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          return `${key}: ${JSON.stringify(value)}`;
        }
        return `${key}: ${value}`;
      }).join(', ');

      div.textContent = `${idValue}: ${content}`;
    }

    
    resultsDiv.appendChild(div);
  });
}

function createResultsPanel() {
  const panel = document.createElement('div');
  panel.id = 'resultsPanel';
  panel.style = `/* Add styling */`;
  document.body.appendChild(panel);
  return panel;
}
// Remove the existing filterBunnies function
function filterBunnies() {
  const raw = document.getElementById("mongoQuery").value;
  let query;
  try {
    query = JSON.parse(raw);
  } catch (e) {
    alert("Invalid JSON");
    return;
  }
  
  fetch(`http://localhost:3000/bunnies?${new URLSearchParams(query)}`)
    .then(res => res.json())
    .then(data => {
      bunnies.length = 0; // properly clear

      for (let doc of data) {
        const bunny = new Bunny(
          doc.x ?? random(width),
          doc.y ?? random(60, height),
          doc.scale ?? random(0.8, 1.2)
        );
        bunny.name = doc.name;
        bunny.color = doc.color;
        bunny.hunger = doc.hunger;
        bunny.vx = doc.vx ?? random(0.3, 1) * (random() > 0.5 ? 1 : -1);
        bunny.petTimer = 15; // blush and wiggle
        bunny.earWiggleTimer = 15;
        draw2();
        bunnies.push(bunny);
      }
    });


  

}

function sendUpdate(filter, update) {
  fetch('http://localhost:3000/bunnies/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filter, update })
  })
    .then(res => res.json())
    .then(result => {
      console.log("Update result:", result);
      alert(`Updated ${result.modifiedCount} bunnies`);
      loadBunniesFromServer(); // refresh
    })
    .catch(err => {
      console.error("Update error:", err);
      alert(`Update Error: ${err.message}`);
    });
}


function mousePressed() {
  for (let bunny of bunnies) {
    bunny.isClicked = true;
  }
}

function mouseReleased() {
  for (let bunny of bunnies) {
    bunny.isClicked = false;
    bunny.hoverTime = 0;
  }
}
