
// server.js
const express = require('express');
const path = require('path');
const { MongoClient, ObjectId, Binary } = require('mongodb'); 
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "mongoGarden";

// Connect to MongoDB once
let db;
async function connectDB() {
  await client.connect();
  db = client.db(dbName);
  console.log("✅ Connected to MongoDB");
}
connectDB();


function convertISODateStrings(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      convertISODateStrings(obj[key]);
    } else if (
      typeof obj[key] === 'string' &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d+)?Z?$/.test(obj[key])
    ) {
      obj[key] = new Date(obj[key]);
    }
  }
}

// server.js
app.get('/bunnies', async (req, res) => {
  try {
    const collection = db.collection('bunnies');
    const input = JSON.parse(req.query.q || '{}');
    convertISODateStrings(input); // ⬅️ This enables proper Date parsing

    if (Array.isArray(input)) {
      // Handle aggregation pipeline
      const results = await collection.aggregate(input).toArray();
      return res.json(results);
    } else {
      // Handle find query
      const results = await collection.find(input).toArray();
      return res.json(results);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});



app.post('/bunnies/update', async (req, res) => {
  const { filter, update } = req.body;

  if (!filter || !update) {
    return res.status(400).send("Missing filter or update");
  }

  // ✅ Convert UUID string to Binary subtype 4 (only if it looks like a UUID)
  if (filter._id && typeof filter._id === 'string') {
    try {
      const uuid = filter._id;
      const hex = uuid.replace(/-/g, '');
      if (hex.length !== 32) throw new Error("Invalid UUID length");

      const buf = Buffer.from(hex, 'hex');
      filter._id = new Binary(buf, Binary.SUBTYPE_UUID); // ✅ proper type
    } catch (err) {
      console.error("UUID parse error:", err.message);
      return res.status(400).json({ error: 'Invalid UUID format' });
    }
  }

  try {
    const collection = db.collection('bunnies');
    const result = await collection.updateOne(filter, update);
    res.json({ matchedCount: result.matchedCount, modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});





app.listen(port, () => {
  console.log(`✅ Server running: http://localhost:${port}`);
});