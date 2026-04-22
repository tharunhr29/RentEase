const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

// DNS Fix for restricted networks
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
 
const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB Connected for Seeding...");

    const adminEmail = "admin@rentease.com";
    const adminPassword = "RentEaseAdmin@2026"; // Generated secure password

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin user already exists. Updating password...");
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      existingAdmin.password = hashedPassword;
      existingAdmin.role = "admin";
      existingAdmin.isVerified = true;
      await existingAdmin.save();
    } else {
      console.log("Creating new admin user...");
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const admin = new User({
        name: "System Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        isVerified: true,
      });
      await admin.save();
    }

    console.log("-----------------------------------------");
    console.log("Admin account successfully set up!");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log("-----------------------------------------");

    process.exit(0);
  } catch (error) {
    console.error("Seed Error:", error);
    process.exit(1);
  }
};

seedAdmin();
