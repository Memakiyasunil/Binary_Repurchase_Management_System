const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();

    // Hash password for seed users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);
    const userPassword = await bcrypt.hash('User@123', salt);

    // Create Super Admin
    const adminUser = await User.create({
      username: 'superadmin',
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@eshop.com',
      mobile: '9999999999',
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
      status: 'active',
      position: 'left'
    });

    // Create a demo user under admin
    const demoUser = await User.create({
      username: 'demouser',
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@eshop.com',
      mobile: '8888888888',
      password: userPassword,
      role: 'user',
      isVerified: true,
      status: 'active',
      sponsorId: adminUser._id,
      uplineId: adminUser._id,
      position: 'left'
    });

    // Seed some products
    const products = [
      {
        name: 'Health Booster 3000',
        code: 'HB3000',
        category: 'Health Products',
        price: 49.99,
        bv: 20,
        pv: 10,
        description: 'Complete daily health supplement.',
        stockQuantity: 100,
        status: 'active'
      },
      {
        name: 'Digital Marketing Mastery',
        code: 'DMM101',
        category: 'Digital Products',
        price: 99.00,
        bv: 50,
        pv: 25,
        description: 'Learn digital marketing from scratch.',
        stockQuantity: 999,
        status: 'active'
      },
      {
        name: 'Premium Monthly Membership',
        code: 'PMM01',
        category: 'Membership Plans',
        price: 199.00,
        bv: 100,
        pv: 50,
        description: 'Access to exclusive leadership training and tools.',
        stockQuantity: 9999,
        status: 'active'
      }
    ];

    await Product.insertMany(products);

    console.log('Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error}`);
    process.exit(1);
  }
};

importData();
