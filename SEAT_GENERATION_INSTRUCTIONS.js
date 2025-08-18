// Instructions for 150 Seats Generation
// =====================================

// Option 1: Use the API endpoint (Recommended)
// 1. Make sure your MongoDB connection string is correct in the .env file
// 2. Start the API server: npm run dev (in the api folder)
// 3. Open browser and go to: http://localhost:5000/api/seat-generator/generate-all-seats
// 4. This will generate 150 seats for all showtimes

// Option 2: Check current seat count
// Go to: http://localhost:5000/api/seats/showtime/YOUR_SHOWTIME_ID
// This will show you how many seats currently exist

// Option 3: Manual MongoDB Script
// If you have access to MongoDB Compass or MongoDB shell:
/*
db.seats.deleteMany({}) // Clear existing seats
// Then run the seat generation script through the API
*/

// The 150 seats will be arranged as:
// - 15 rows (A through O)
// - 10 seats per row (1-10)
// - Total: 150 seats
// - Categories: Mixed (Standard, Premium, VIP) - all priced at ₹150

console.log("📋 Instructions for 150 seats generation ready!");
console.log("🎬 Movie images added to all pages!");
console.log("💰 All seats now cost ₹150!");
console.log("📱 Phone verification synced between pages!");
