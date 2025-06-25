const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Create export directory
const exportDir = path.join(__dirname, 'export');
if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true });
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Get all collections
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log(`Found ${collections.length} collections`);
  
  // Export each collection
  for (const collection of collections) {
    const collectionName = collection.name;
    console.log(`Exporting collection: ${collectionName}`);
    
    const data = await mongoose.connection.db.collection(collectionName).find({}).toArray();
    
    fs.writeFileSync(
      path.join(exportDir, `${collectionName}.json`),
      JSON.stringify(data, null, 2)
    );
    
    console.log(`Exported ${data.length} documents from ${collectionName}`);
  }
  
  console.log('Export complete! Files saved to database/export directory');
  process.exit(0);
})
.catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
}); 