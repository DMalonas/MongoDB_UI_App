use('mongoGarden'); // ✅ Must be lowercase and match Compass
db.bunnies.insertMany([
  { "name": "Clover",   "age": 2, "color": "white",     "hunger": 3 },
  { "name": "Frost",    "age": 1, "color": "icy_blue",  "hunger": 4 },
  { "name": "Peachy",   "age": 3, "color": "blus_peach","hunger": 2 },
  { "name": "Rosie",    "age": 2, "color": "pink",      "hunger": 5 },
  { "name": "Lilac",    "age": 4, "color": "lilac",     "hunger": 1 },
  { "name": "Mellow",   "age": 1, "color": "cream",     "hunger": 3 }
]);


use('mongoGarden');
db.bunnies.updateMany(
  { last_meal: { $type: "string" } },
  [
    {
      $set: {
        last_meal: { $toDate: "$last_meal" }
      }
    }
  ]
);

db.bunnies.find({ color: 'white' });

db.bunnies.updateMany(
  { color: 'white' },
  { $set: { hunger: 10 } }
);


//updates the last_meal field to be a date type 
// and ensures that each date field within 
// the campaigns array is also converted to a date type.
use('mongoGarden');
db.bunnies.updateMany(
  {},
  [
    {
      $set: {
        last_meal: {
          $toDate: "$last_meal"
        },
        "campaigns": {
          $map: {
            input: "$campaigns",
            as: "c",
            in: {
              $mergeObjects: [
                "$$c",
                { date: { $toDate: "$$c.date" } }
              ]
            }
          }
        }
      }
    }
  ]
)

//update 5 random bunnies's hunger to be 8 or more
use('mongoGarden');
db.bunnies.aggregate([
  { $sample: { size: 5 } },
  { $project: { _id: 1 } }
]).forEach(function(doc) {
  db.bunnies.updateOne({ _id: doc._id }, { $set: { hunger: Math.floor(Math.random() * 3) + 8 } });
});













///SIMPLE QUERIES
use('mongoGarden');
db.bunnies.find({ hunger: { $gte: 7 } }); // 1. Bunnies with high hunger
db.bunnies.find({ hunger: 0 }); // 2. Bunnies with no hunger
db.bunnies.find({ age: { $gte: 6 } }); // 3. Bunnies age 6+ (older)
db.bunnies.find({ age: { $lte: 2 } }); // 4. Bunnies under age 2 (young)
db.bunnies.find({ "location.zone": "South Hollow" }); // 5. Bunnies in South Hollow
db.bunnies.find({ "location.zone": "North Meadow" }); // 6. Bunnies in North Meadow
db.bunnies.find({ "location.zone": "West Field" }); // 7. Bunnies in West Field
db.bunnies.find({ color: "white" }); // 8. Bunnies with color: white
db.bunnies.find({ color: "pink" }); // 9. Bunnies with color: pink
db.bunnies.find({ interests: "digging" }); // 10. Bunnies who love digging
db.bunnies.find({ interests: "technology" }); // 11. Bunnies interested in technology
db.bunnies.find({ interests: "gardening" }); // 12. Bunnies who garden
db.bunnies.find({ microchipped: false }); // 13. Bunnies who are not microchipped
db.bunnies.find({ microchipped: true }); // 14. Bunnies who are microchipped
db.bunnies.find({ household_size: 1 }); // 15. Bunnies with household size = 1
db.bunnies.find({ household_size: { $gte: 3 } }); // 16. Bunnies with household size ≥ 3
db.bunnies.find({ tech_savviness: { $lte: 2 } }); // 17. Bunnies with tech_savviness ≤ 2
db.bunnies.find({ tech_savviness: 5 }); // 18. Bunnies with tech_savviness = 5
db.bunnies.find({ name: "Daisy" }); // 19. Bunnies whose name is Daisy
db.bunnies.find({ "campaigns.name": "Eco Flyer 1", "campaigns.engaged": true }); // 20. Bunnies who have engaged in Eco Flyer 1
db.bunnies.find({ "campaigns.engaged": false }); // 21. Bunnies who did not engage in any campaign
use('mongoGarden');
// Bunnies who had a meal before June 5, 2025
db.bunnies.find({
  last_meal: { $lt: new Date("2025-06-05T00:00:00Z") }
});

//Bunnies who had a meal on June 4, 2025
db.bunnies.find({
  last_meal: {
    $gte: new Date("2025-06-04T00:00:00Z"),
    $lt: new Date("2025-06-05T00:00:00Z")
  }
});// 23. Bunnies who had a meal on June 4th, 2025
db.bunnies.find({ "campaigns.1": { $exists: true } }); // 24. Bunnies with at least 2 campaigns
db.bunnies.find({
  notes: {
    $regex: "lead[s]? wellness session[s]?",
    $options: "i"
  }
}); // 25. Bunnies who lead wellness sessions (by notes)
db.bunnies.find({
  notes: {
    $regex: "curious about.*burrow tech",
    $options: "i"
  }
}); // 26. Bunnies curious about burrow tech (by notes)
db.bunnies.find({
  hunger: 5,
  tech_savviness: { $lte: 2 }
}); // 27. Bunnies with hunger = 5 and tech_savviness ≤ 2
db.bunnies.find({
  age: { $gte: 4 },
  microchipped: false
}); // 28. Bunnies with age ≥ 4 and not chipped
db.bunnies.find({
  "location.zone": "South Hollow",
  hunger: { $gte: 6 }
}); // 29. Bunnies in South Hollow with hunger ≥ 6
db.bunnies.find({
  interests: { $all: ["meditation", "carrots"] }
}); // 30. Bunnies who like meditation & carrots
use('mongoGarden'); // ✅ Must be lowercase and match Compass
db.bunnies.insertMany([
  { "name": "Clover",   "age": 2, "color": "white",     "hunger": 3 },
  { "name": "Frost",    "age": 1, "color": "icy_blue",  "hunger": 4 },
  { "name": "Peachy",   "age": 3, "color": "blus_peach","hunger": 2 },
  { "name": "Rosie",    "age": 2, "color": "pink",      "hunger": 5 },
  { "name": "Lilac",    "age": 4, "color": "lilac",     "hunger": 1 },
  { "name": "Mellow",   "age": 1, "color": "cream",     "hunger": 3 }
]);


use('mongoGarden');
db.bunnies.updateMany(
  { last_meal: { $type: "string" } },
  [
    {
      $set: {
        last_meal: { $toDate: "$last_meal" }
      }
    }
  ]
);

db.bunnies.find({ color: 'white' });

db.bunnies.updateMany(
  { color: 'white' },
  { $set: { hunger: 10 } }
);


//updates the last_meal field to be a date type 
// and ensures that each date field within 
// the campaigns array is also converted to a date type.
use('mongoGarden');
db.bunnies.find({ campaigns: { $not: { $type: "array" } } })

use('mongoGarden');
db.bunnies.updateMany(
  { campaigns: null },
  { $set: { campaigns: [] } }
);

db.bunnies.updateMany(
  {},
  [
    {
      $set: {
        last_meal: {
          $toDate: "$last_meal"
        },
        "campaigns": {
          $map: {
            input: "$campaigns",
            as: "c",
            in: {
              $mergeObjects: [
                "$$c",
                { date: { $toDate: "$$c.date" } }
              ]
            }
          }
        }
      }
    }
  ]
)

//update 5 random bunnies's hunger to be 8 or more
use('mongoGarden');
db.bunnies.aggregate([
  { $sample: { size: 5 } },
  { $project: { _id: 1 } }
]).forEach(function(doc) {
  db.bunnies.updateOne({ _id: doc._id }, { $set: { hunger: Math.floor(Math.random() * 3) + 8 } });
});













///SIMPLE QUERIES
use('mongoGarden');

db.bunnies.find({ hunger: { $gte: 7 } }); // 1. Bunnies with high hunger
db.bunnies.find({ hunger: 0 }); // 2. Bunnies with no hunger
db.bunnies.find({ age: { $gte: 6 } }); // 3. Bunnies age 6+ (older)
db.bunnies.find({ age: { $lte: 2 } }); // 4. Bunnies under age 2 (young)
db.bunnies.find({ "location.zone": "South Hollow" }); // 5. Bunnies in South Hollow
db.bunnies.find({ "location.zone": "North Meadow" }); // 6. Bunnies in North Meadow
db.bunnies.find({ "location.zone": "West Field" }); // 7. Bunnies in West Field
db.bunnies.find({ color: "white" }); // 8. Bunnies with color: white
db.bunnies.find({ color: "pink" }); // 9. Bunnies with color: pink
db.bunnies.find({ interests: "digging" }); // 10. Bunnies who love digging
db.bunnies.find({ interests: "technology" }); // 11. Bunnies interested in technology
db.bunnies.find({ interests: "gardening" }); // 12. Bunnies who garden
db.bunnies.find({ microchipped: false }); // 13. Bunnies who are not microchipped
db.bunnies.find({ microchipped: true }); // 14. Bunnies who are microchipped
db.bunnies.find({ household_size: 1 }); // 15. Bunnies with household size = 1
db.bunnies.find({ household_size: { $gte: 3 } }); // 16. Bunnies with household size ≥ 3
db.bunnies.find({ tech_savviness: { $lte: 2 } }); // 17. Bunnies with tech_savviness ≤ 2
db.bunnies.find({ tech_savviness: 5 }); // 18. Bunnies with tech_savviness = 5
db.bunnies.find({ name: "Daisy" }); // 19. Bunnies whose name is Daisy
db.bunnies.find({ "campaigns.name": "Eco Flyer 1", "campaigns.engaged": true }); // 20. Bunnies who have engaged in Eco Flyer 1
db.bunnies.find({ "campaigns.engaged": false }); // 21. Bunnies who did not engage in any campaign
db.bunnies.find({ last_meal: { $lt: "2025-06-05T00:00:00" } }); // 22. Bunnies who had a meal before June 5, 2025
db.bunnies.find({
  last_meal: {
    $gte: "2025-06-04T00:00:00",
    $lt: "2025-06-05T00:00:00"
  }
}); // 23. Bunnies who had a meal on June 4th, 2025
db.bunnies.find({ "campaigns.1": { $exists: true } }); // 24. Bunnies with at least 2 campaigns
db.bunnies.find({
  notes: {
    $regex: "lead[s]? wellness session[s]?",
    $options: "i"
  }
}); // 25. Bunnies who lead wellness sessions (by notes)
db.bunnies.find({
  notes: {
    $regex: "curious about.*burrow tech",
    $options: "i"
  }
}); // 26. Bunnies curious about burrow tech (by notes)
db.bunnies.find({
  hunger: 5,
  tech_savviness: { $lte: 2 }
}); // 27. Bunnies with hunger = 5 and tech_savviness ≤ 2
db.bunnies.find({
  age: { $gte: 4 },
  microchipped: false
}); // 28. Bunnies with age ≥ 4 and not chipped
db.bunnies.find({
  "location.zone": "South Hollow",
  hunger: { $gte: 6 }
}); // 29. Bunnies in South Hollow with hunger ≥ 6
db.bunnies.find({
  interests: { $all: ["meditation", "carrots"] }
}); // 30. Bunnies who like meditation & carrots








///Aggregation queries
use('mongoGarden');
// 1. Multi-risk bunnies (high hunger, unchipped, isolated)
db.bunnies.aggregate([
  {
    $match: {
      $and: [
        { hunger: { $gte: 7 } },
        { microchipped: false },
        { household_size: { $lte: 1 } }
      ]
    }
  }
]);

use('mongoGarden');
// 2. Multi-risk bunnies (project name, age, zone)
db.bunnies.aggregate([
  {
    $match: {
      $and: [
        { hunger: { $gte: 7 } },
        { microchipped: false },
        { household_size: { $lte: 1 } }
      ]
    }
  },
  {
    $project: {
      _id: 0,
      name: 1,
      age: 1,
      "location.zone": 1
    }
  }
]);

use('mongoGarden');
// 3. High-risk zones (group + sort by at-risk count)
db.bunnies.aggregate([
  {
    $match: {
      $or: [
        { hunger: { $gte: 7 } },
        { microchipped: false },
        { household_size: { $lte: 1 } }
      ]
    }
  },
  {
    $group: {
      _id: "$location.zone",
      atRiskCount: { $sum: 1 }
    }
  },
  {
    $sort: { atRiskCount: -1 }
  }
]);

use('mongoGarden');
// 4. Tech gap zones (avg tech_savviness ≤ 2)
db.bunnies.aggregate([
  {
    $group: {
      _id: "$location.zone",
      avgTech: { $avg: "$tech_savviness" }
    }
  },
  {
    $match: { avgTech: { $lte: 2 } }
  },
  {
    $sort: { avgTech: 1 }
  }
]);


use('mongoGarden');
// 5. Senior isolation (age ≥ 4, household_size ≤ 1)
db.bunnies.aggregate([
  {
    $match: {
      $and: [
        { age: { $gte: 4 } },
        { household_size: { $lte: 1 } }
      ]
    }
  },
  {
    $project: {
      name: 1,
      location: 1
    }
  }
]);


use('mongoGarden');
// 6. Ignored campaigns (empty or all false)
db.bunnies.aggregate([
  {
    $match: {
      $or: [
        { campaigns: { $eq: [] } },
        { "campaigns.engaged": false }
      ]
    }
  }
]);


use('mongoGarden');
// 7. Ignored campaigns (with projection)
db.bunnies.aggregate([
  {
    $match: {
      $or: [
        { campaigns: { $eq: [] } },
        { "campaigns.engaged": false }
      ]
    }
  },
  {
    $project: {
      name: 1,
      age: 1,
      "location.zone": 1
    }
  }
]);


use('mongoGarden');
// 8. Underrepresented colors (3 least common)
db.bunnies.aggregate([
  {
    $group: {
      _id: "$color",
      count: { $sum: 1 }
    }
  },
  {
    $sort: { count: 1 }
  },
  {
    $limit: 3
  }
]);

use('mongoGarden');
// 9. Campaign fatigue (2+ campaigns, ≤ 1 engagement)
db.bunnies.aggregate([
  {
    $project: {
      name: 1,
      engagedCount: {
        $size: {
          $filter: {
            input: "$campaigns",
            as: "c",
            cond: { $eq: ["$$c.engaged", true] }
          }
        }
      },
      totalCampaigns: { $size: "$campaigns" }
    }
  },
  {
    $match: {
      $and: [
        { totalCampaigns: { $gte: 2 } },
        { engagedCount: { $lte: 1 } }
      ]
    }
  }
]);


use('mongoGarden');
// 10. Zone loyalty (only engages in campaigns matching their zone)
db.bunnies.aggregate([
  {
    $match: {
      $expr: {
        $allElementsTrue: {
          $map: {
            input: "$campaigns",
            as: "c",
            in: {
              $regexMatch: {
                input: "$$c.name",
                regex: "$location.zone"
              }
            }
          }
        }
      }
    }
  }
]);