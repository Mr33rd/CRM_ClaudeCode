const db = require('../models');
const { testConnection } = require('../config/database');

const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing database...\n');

    // Test connection
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ Database connection failed. Exiting...');
      process.exit(1);
    }

    // Sync all models
    console.log('🔄 Synchronizing database models...');
    await db.sequelize.sync({ alter: true });
    console.log('✓ Database models synchronized successfully!\n');

    console.log('✓ Database initialization completed successfully!');
    console.log('\n📊 Models created:');
    console.log('  - Users');
    console.log('  - Students');
    console.log('  - Belt Progressions');
    console.log('  - Assessments');
    console.log('  - Attendances');
    console.log('  - Sessions');
    console.log('  - Payments');
    console.log('  - Graduations');
    console.log('  - Coaching Notes');
    console.log('\n✨ Database is ready for use!\n');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = initializeDatabase;
