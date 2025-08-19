import mongoose from 'mongoose';
import User from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

async function updateAdminRole() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO);
    console.log('✅ Connected to MongoDB');

    // Find the existing admin user
    const adminUser = await User.findOne({ email: 'admin@cinexp.com' });
    
    if (!adminUser) {
      console.log('❌ Admin user not found!');
      process.exit(1);
    }

    console.log('📋 Current admin user data:');
    console.log('📧 Email:', adminUser.email);
    console.log('👤 Username:', adminUser.username);
    console.log('🛡️  Current Role:', adminUser.role || 'undefined');
    console.log('✅ Active:', adminUser.isActive);

    // Update the role to admin
    const updatedUser = await User.findByIdAndUpdate(
      adminUser._id,
      { 
        role: 'admin',
        isActive: true
      },
      { new: true }
    );

    console.log('\n✅ Admin user updated successfully!');
    console.log('📋 Updated admin user data:');
    console.log('📧 Email:', updatedUser.email);
    console.log('👤 Username:', updatedUser.username);
    console.log('🛡️  Role:', updatedUser.role);
    console.log('✅ Active:', updatedUser.isActive);

    console.log('\n🎬 ADMIN LOGIN CREDENTIALS:');
    console.log('📧 Email: admin@cinexp.com');
    console.log('🔑 Password: CinAdmin2024!');
    console.log('🌐 Admin Panel: http://localhost:5173/admin/dashboard');

    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error updating admin role:', error.message);
    process.exit(1);
  }
}

updateAdminRole();
