require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./config/supabase');

async function resetAdmin() {
  try {
    const email = 'admin@shopkart.com';
    const password = 'admin123';
    console.log(`Setting up admin account: ${email}...`);

    let existing = await db.users.findByEmail(email);
    if (existing) {
      console.log('Admin account found. Updating password...');
      await db.users.update(existing.id || existing._id, { password, role: 'admin' });
    } else {
      console.log('Admin account not found. Creating new admin...');
      await db.users.create({
        name: 'Admin User',
        email,
        password,
        phone: '+91 9876543210'
      });
      // Ensure role is admin
      const created = await db.users.findByEmail(email);
      if (created) await db.users.update(created.id || created._id, { role: 'admin' });
    }

    console.log('✅ Admin account ready:');
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${password}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error resetting admin:', err.message);
    process.exit(1);
  }
}

resetAdmin();
