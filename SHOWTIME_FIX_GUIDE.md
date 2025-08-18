# How to Fix "No Showtimes Available" Issue

The booking system is failing because there are no showtimes in the database. This guide will help you fix this issue.

## Option 1: Run the Add-Showtimes Script (Recommended)

1. Open a terminal in the `mern-auth` directory
2. Run the script:

```bash
# Make sure server is not running
cd api
node ../add-showtimes.js
```

3. The script will:
   - Connect to your MongoDB database
   - Find all movies without showtimes
   - Create showtime entries based on movie timing fields
   - Update movie documents with references to the showtimes

4. Restart your server:

```bash
npm run dev
```

5. Refresh your browser and the booking options should now work

## Option 2: Manually Add Showtimes

If the script doesn't work, you can add showtimes manually using MongoDB Compass or another MongoDB client:

1. Connect to your database
2. Go to the `showtimes` collection
3. Add a new document:

```javascript
{
  "movieId": ObjectId("YOUR_MOVIE_ID"), // Replace with actual ID
  "screen": "Screen 2", // Match movie's screen
  "startTime": ISODate("2025-08-18T12:00:00Z"), // Use movie's timing
  "endTime": ISODate("2025-08-18T14:30:00Z"), // About 2.5 hours later
  "isActive": true,
  "seatsAvailable": 64
}
```

4. Update the movie document to include the showtime:
   - Go to the `movies` collection
   - Find the movie you added the showtime for
   - Add the showtime ID to the `showtimes` array field

## Option 3: Use the API

You can also use the API to create showtimes:

```bash
curl -X POST http://localhost:5000/api/showtimes \
  -H "Content-Type: application/json" \
  -d '{
    "movieId": "YOUR_MOVIE_ID", 
    "screen": "Screen 2", 
    "startTime": "2025-08-18T12:00:00Z", 
    "endTime": "2025-08-18T14:30:00Z", 
    "isActive": true
  }'
```

## Verifying the Fix

After adding showtimes:

1. Go to the homepage
2. "Real-time booking not available" messages should disappear
3. The "Book Now" button should work
4. You should be able to select seats for booking

## Need More Help?

If you're still encountering issues:

1. Check your MongoDB connection
2. Verify your Movie model has a `showtimes` field
3. Ensure the API is properly populating showtimes when fetching movies
4. Check for errors in the browser console or server logs
