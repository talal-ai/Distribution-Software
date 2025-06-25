# Database Migration Guide

This guide explains how to transfer MongoDB data from your computer to your collaborator's computer.

## On Your Computer (Source)

1. Make sure MongoDB is running
2. Open PowerShell or Command Prompt
3. Navigate to the project root directory:
   ```
   cd path\to\Distribution Software
   ```
4. Run the export script:
   ```
   node database/export-data.js
   ```
5. This will create JSON files for each collection in the `database/export` directory

## Transferring Files

1. Zip the entire `database/export` directory:
   ```
   Compress-Archive -Path database/export -DestinationPath database-export.zip
   ```
2. Transfer the zip file to your collaborator via:
   - Email (if small enough)
   - Cloud storage (Google Drive, Dropbox, etc.)
   - USB drive
   - Network file sharing

## On Your Collaborator's Computer (Destination)

1. Make sure MongoDB is installed and running
2. Make sure the project is set up (Node.js, dependencies installed)
3. Create the `.env` file with the correct MongoDB URI:
   ```
   NODE_ENV=development
   PORT=5002
   MONGO_URI=mongodb://localhost:27017/distribution_system
   JWT_SECRET=distribution_system_secret_key_12345
   JWT_EXPIRE=30d
   ```
4. Extract the received zip file to the `database/export` directory
5. Open PowerShell or Command Prompt
6. Navigate to the project root directory:
   ```
   cd path\to\Distribution Software
   ```
7. Run the import script:
   ```
   node database/import-data.js
   ```
8. Verify the data was imported correctly by running the application:
   ```
   npm run dev
   ```

## Troubleshooting

If you encounter any issues during the migration process:

1. **Connection Issues**: Make sure MongoDB is running on both computers
2. **Permission Issues**: Run the terminal as administrator if needed
3. **Path Issues**: Make sure you're in the correct directory
4. **Import Errors**: Check if the export files are valid JSON
5. **MongoDB Version Mismatch**: Try to use the same MongoDB version on both computers

## Important Notes

- This process will **overwrite** any existing data in the destination database
- Make sure to backup any important data before importing
- If your database is very large, consider splitting the export into smaller chunks 