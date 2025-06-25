const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Path to exported data
const exportDir = path.join(__dirname, 'export');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Read all files in the export directory
  const files = fs.readdirSync(exportDir).filter(file => file.endsWith('.json'));
  console.log(`Found ${files.length} collection files to import`);
  
  // Import each collection
  for (const file of files) {
    const collectionName = file.replace('.json', '');
    console.log(`Importing collection: ${collectionName}`);
    
    // Read the data
    const data = JSON.parse(fs.readFileSync(path.join(exportDir, file), 'utf8'));
    
    if (data.length === 0) {
      console.log(`No data to import for ${collectionName}`);
      continue;
    }
    
    // Drop existing collection if it exists
    try {
      await mongoose.connection.db.dropCollection(collectionName);
      console.log(`Dropped existing collection: ${collectionName}`);
    } catch (err) {
      // Collection might not exist yet
      console.log(`Creating new collection: ${collectionName}`);
    }
    
    // Insert the data
    await mongoose.connection.db.collection(collectionName).insertMany(data);
    console.log(`Imported ${data.length} documents into ${collectionName}`);
  }
  
  console.log('Import complete!');
  process.exit(0);
})
.catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
}); 