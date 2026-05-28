const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userModel = require('./models/userModels');

// Load environment variables
dotenv.config();

const elevateUser = async () => {
  const email = process.argv[2];
  
  if (!email) {
    console.log('Error: Please provide a user email. Example: node make-admin.js user@example.com');
    process.exit(1);
  }

  if (!process.env.MONGO_URL) {
    console.log('Error: MONGO_URL not found in .env file.');
    process.exit(1);
  }

  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected successfully!');

    console.log(`Searching for user with email: ${email}...`);
    const user = await userModel.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      console.log(`Error: No user found with email "${email}"`);
      process.exit(1);
    }

    user.isAdmin = true;
    await user.save();

    console.log(`Success! User "${user.name}" (${user.email}) has been elevated to Administrator.`);
    process.exit(0);
  } catch (error) {
    console.error('Error during elevation:', error);
    process.exit(1);
  }
};

elevateUser();
