const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from the backend/.env file
dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env file');
  process.exit(1);
}

console.log('Attempting to connect to MongoDB...');
console.log(`URI: ${MONGODB_URI.replace(/\/\/.*@/, '//****:****@')}`); // Masking credentials

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB Atlas!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Connection failed:');
    console.error(err.message);
    process.exit(1);
  });
