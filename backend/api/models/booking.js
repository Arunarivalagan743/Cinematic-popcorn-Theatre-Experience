// // // models/booking.js
// // const mongoose = require('mongoose');

// // // Define the schema for parking details
// // const parkingDetailsSchema = new mongoose.Schema({
// //   parkingType: {
// //     type: String,
// //     required: false,
// //   },
// //   phone: {
// //     type: String,
// //     required: false,
// //   },
// //   vehicleNumber: {
// //     type: String,
// //     required: false,
// //   },
// // }, { _id: false }); // Prevents creating a separate _id for this sub-document

// // // Define the schema for booking
// // const bookingSchema = new mongoose.Schema({
// //   movie: {
// //     type: String,
// //     required: true,
// //     trim: true,
// //   },
// //   screen: {
// //     type: String,
// //     required: true,
// //     trim: true,
// //   },
// //   timing: {
// //     type: String,
// //     required: true,
// //     trim: true,
// //   },
// //   seats: {
// //     type: [String],  // Array of strings to hold seat numbers (like 'A1', 'A2', etc.)
// //     required: true,
// //   },
// //   totalCost: {
// //     type: Number,
// //     required: true,
// //   },
// //   parkingDetails: {
// //     type: parkingDetailsSchema,  // Use the parking details schema defined above
// //     required: false,  // This is optional
// //   },
// // }, { timestamps: true });  // Automatically add createdAt and updatedAt fields

// // // Create the Booking model from the schema
// // const Booking = mongoose.model('Booking', bookingSchema);

// // // Export the Booking model for use in other files
// // module.exports = Booking;
// const mongoose = require('mongoose');

// // Define the schema for parking details
// const parkingDetailsSchema = new mongoose.Schema({
//   parkingType: {
//     type: String,
//     required: false,
//   },
//   phone: {
//     type: String,
//     required: false,
//   },
//   vehicleNumber: {
//     type: String,
//     required: false,
//   },
// }, { _id: false }); // Prevents creating a separate _id for this sub-document

// // Define the schema for booking
// const bookingSchema = new mongoose.Schema({
//   movie: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   screen: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   timing: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   seats: {
//     type: [String],  // Array of strings to hold seat numbers (like 'A1', 'A2', etc.)
//     required: true,
//   },
//   totalCost: {
//     type: Number,
//     required: true,
//   },
//   parkingDetails: {
//     type: parkingDetailsSchema,  // Use the parking details schema defined above
//     required: false,  // This is optional
//   },
//   userEmail: { // Add user email field
//     type: String,
//     required: true, // Make this required if you want to enforce it
//     trim: true,
//   },
// }, { timestamps: true });  // Automatically add createdAt and updatedAt fields

// // Create the Booking model from the schema
// const Booking = mongoose.model('Booking', bookingSchema);

// // Export the Booking model for use in other files
// module.exports = Booking;
