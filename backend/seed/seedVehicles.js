require("dotenv").config();
const mongoose = require("mongoose");
const Vehicle = require("../models/Vehicle");

const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

const v = (name, brand, model, category, year, price, fuel, trans, km, cond, loc, desc, phone, specs, days) => ({
  name, brand, model, category,
  manufacturingYear: year,
  price,
  fuelType: fuel,
  transmission: trans,
  kilometersDriven: km,
  condition: cond,
  location: loc,
  description: desc,
  contactNumber: phone,
  specs,
  images: [],
  status: "available",
  createdAt: daysAgo(days),
});

const vehicles = [
  v("Maruti Suzuki Swift VXi", "Maruti Suzuki", "Swift", "Cars", 2019, 485000, "Petrol", "Manual", 42000, "Good", "Hyderabad",
    "Well-maintained Swift VXi with full service history. Single owner, no accidents, and excellent fuel efficiency for city driving.",
    "9876500001", { Engine: "1197 cc", Mileage: "22 kmpl", Owners: "1st owner", Color: "Pearl White" }, 7),
  v("Hyundai i20 Sportz", "Hyundai", "i20", "Cars", 2020, 625000, "Petrol", "Manual", 31000, "Excellent", "Bengaluru",
    "Premium hatchback with touchscreen infotainment, rear camera and alloy wheels. Looks and drives like new.",
    "9876500002", { Engine: "1197 cc", Mileage: "20 kmpl", Owners: "1st owner", Color: "Typhoon Silver" }, 9),
  v("Tata Nexon XZ Plus", "Tata", "Nexon", "Cars", 2021, 875000, "Diesel", "Manual", 38000, "Good", "Chennai",
    "Compact SUV with a 5-star safety rating, sunroof and a powerful diesel engine. Regularly serviced at an authorised centre.",
    "9876500003", { Engine: "1497 cc", Mileage: "21 kmpl", Owners: "1st owner", Color: "Flame Red" }, 12),
  v("Honda City ZX", "Honda", "City", "Cars", 2018, 720000, "Petrol", "Automatic", 55000, "Good", "Hyderabad",
    "Comfortable sedan with a spacious cabin, automatic gearbox and sunroof. Ideal for family and highway trips.",
    "9876500004", { Engine: "1497 cc", Mileage: "17 kmpl", Owners: "2nd owner", Color: "Modern Steel" }, 17),
  v("Royal Enfield Classic 350", "Royal Enfield", "Classic 350", "Bikes", 2020, 165000, "Petrol", "Manual", 18000, "Excellent", "Pune",
    "Iconic cruiser in great shape with the classic thump. Fitted with crash guard and a touring seat.",
    "9876500005", { Engine: "349 cc", Mileage: "35 kmpl", Owners: "1st owner", Color: "Stealth Black" }, 5),
  v("Yamaha FZ V3", "Yamaha", "FZ", "Bikes", 2019, 72000, "Petrol", "Manual", 26000, "Good", "Hyderabad",
    "Sporty street bike with smooth handling and good mileage. Recently serviced with new tyres.",
    "9876500006", { Engine: "149 cc", Mileage: "45 kmpl", Owners: "1st owner", Color: "Metallic Blue" }, 15),
  v("Bajaj Pulsar 150", "Bajaj", "Pulsar 150", "Bikes", 2017, 48000, "Petrol", "Manual", 52000, "Fair", "Vijayawada",
    "Reliable daily commuter with a strong engine. Some cosmetic wear but mechanically sound.",
    "9876500007", { Engine: "149 cc", Mileage: "50 kmpl", Owners: "2nd owner", Color: "Black" }, 30),
  v("Honda Activa 6G", "Honda", "Activa 6G", "Scooties", 2021, 62000, "Petrol", "Automatic", 14000, "Excellent", "Hyderabad",
    "India's favourite scooter in excellent condition. Smooth, quiet and very fuel efficient.",
    "9876500008", { Engine: "109 cc", Mileage: "50 kmpl", Owners: "1st owner", Color: "Pearl Grey" }, 2),
  v("TVS Jupiter ZX", "TVS", "Jupiter", "Scooties", 2020, 54000, "Petrol", "Automatic", 21000, "Good", "Chennai",
    "Comfortable scooter with roomy under-seat storage and an external fuel filler cap.",
    "9876500009", { Engine: "110 cc", Mileage: "55 kmpl", Owners: "1st owner", Color: "Galaxy Blue" }, 22),
  v("Suzuki Access 125", "Suzuki", "Access 125", "Scooties", 2019, 49000, "Petrol", "Automatic", 29000, "Good", "Bengaluru",
    "Peppy 125cc scooter with a refined engine and a comfortable seat for long rides.",
    "9876500010", { Engine: "124 cc", Mileage: "52 kmpl", Owners: "1st owner", Color: "Metallic Red" }, 37),
  v("Tata 407 Cargo Truck", "Tata", "407", "Lorries", 2017, 780000, "Diesel", "Manual", 145000, "Fair", "Hyderabad",
    "Light commercial truck, popular for city goods transport. Recently overhauled engine and new tyres.",
    "9876500011", { Engine: "3300 cc", Payload: "2.5 tonnes", Owners: "2nd owner", Color: "White" }, 19),
  v("Tata LPT 1109 Truck", "Tata", "LPT 1109", "Lorries", 2016, 1250000, "Diesel", "Manual", 210000, "Good", "Visakhapatnam",
    "Medium-duty truck with a strong chassis and a valid permit. Well suited to long-distance cargo.",
    "9876500012", { Engine: "5675 cc", Payload: "7 tonnes", Owners: "2nd owner", Color: "Blue" }, 42),
];

async function seed() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing. Create a .env file first.");
  }
  await mongoose.connect(process.env.MONGO_URI);

  const force = process.argv.includes("--force");
  const existing = await Vehicle.countDocuments();

  if (existing > 0 && !force) {
    console.log(`The database already has ${existing} vehicles. Nothing was changed.`);
    console.log('To delete ALL vehicles and reload the samples, run: npm run seed -- --force');
  } else {
    if (force) await Vehicle.deleteMany({});
    await Vehicle.insertMany(vehicles);
    console.log(`Added ${vehicles.length} sample vehicles.`);
  }

  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error("Seeding failed:", error.message);
  process.exit(1);
});