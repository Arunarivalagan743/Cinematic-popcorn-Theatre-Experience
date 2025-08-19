import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

async function createAdminUser() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: 'admin@cinexp.com' },
        { role: 'admin' }
      ]
    });

    if (existingAdmin) {
      console.log('👤 Admin user already exists:');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Username:', existingAdmin.username);
      console.log('🛡️  Role:', existingAdmin.role);
      
      // Update existing user to admin if not already
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('⬆️  Updated existing user to admin role');
      }
      
      console.log('\n🎬 LOGIN CREDENTIALS:');
      console.log('📧 Email: admin@cinexp.com');
      console.log('🔑 Password: CinAdmin2024!');
      console.log('🌐 Admin Panel: http://localhost:5173/admin/dashboard');
      
      process.exit(0);
    }

    console.log('👤 Creating new admin user...');
    // Create new admin user
    const adminData = {
      username: 'cinadmin',
      email: 'admin@cinexp.com',
      password: bcryptjs.hashSync('CinAdmin2024!', 10),
      role: 'admin',
      isActive: true,
      lastLogin: new Date()
    };

    const adminUser = new User(adminData);
    await adminUser.save();

    console.log('✅ Admin user created successfully!');
    console.log('\n🎬 LOGIN CREDENTIALS:');
    console.log('📧 Email: admin@cinexp.com');
    console.log('🔑 Password: CinAdmin2024!');
    console.log('👤 Username: cinadmin');
    console.log('🛡️  Role: admin');
    console.log('🌐 Admin Panel: http://localhost:5173/admin/dashboard');
    console.log('\n🚀 You can now login to the admin panel!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createAdminUser();
}

export default createAdminUser;
