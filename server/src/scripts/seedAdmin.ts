import { connectDatabase, disconnectDatabase } from '../config/db.js';
import { Admin } from '../models/Admin.model.js';
import { logger } from '../config/logger.js';

/**
 * Seed the first admin user.
 * Usage: npm run seed:admin
 *
 * Environment variables required:
 *   ADMIN_EMAIL    — Admin email address
 *   ADMIN_PASSWORD — Admin password (min 8 characters)
 */
async function seedAdmin(): Promise<void> {
  const email = process.env['ADMIN_EMAIL'] ?? 'admin@travelassistant.com';
  const password = process.env['ADMIN_PASSWORD'] ?? 'Admin@12345678';

  if (password.length < 8) {
    console.error('❌ ADMIN_PASSWORD must be at least 8 characters');
    process.exit(1);
  }

  try {
    await connectDatabase();

    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log(`⚠️  Admin with email "${email}" already exists. Skipping.`);
      await disconnectDatabase();
      process.exit(0);
    }

    const admin = new Admin({
      email,
      passwordHash: password, // Will be hashed by the pre-save hook
      role: 'super_admin',
    });

    await admin.save();

    console.log(`✅ Admin user created successfully!`);
    console.log(`   Email: ${email}`);
    console.log(`   Role: super_admin`);
    console.log(`\n   Use these credentials to log in to the admin dashboard.`);

    await disconnectDatabase();
    process.exit(0);
  } catch (err) {
    logger.error({ err }, 'Failed to seed admin user');
    console.error('❌ Failed to seed admin:', err);
    await disconnectDatabase();
    process.exit(1);
  }
}

void seedAdmin();
