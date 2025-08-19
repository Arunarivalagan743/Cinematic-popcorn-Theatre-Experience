# 🎬 CINEMATIC POPCORN ADMIN PANEL

## 🔐 Admin Login Credentials

### Default Admin Account:
- **Email:** `admin@cinexp.com`
- **Password:** `CinAdmin2024!`
- **Username:** `cinadmin`
- **Role:** `admin`

## 🚀 How to Access Admin Panel

1. **Start the Backend Server:**
   ```bash
   cd mern-auth
   npm run dev
   ```

2. **Start the Frontend:**
   ```bash
   cd mern-auth/client
   npm run dev
   ```

3. **Access Admin Panel:**
   - Go to: `http://localhost:5173`
   - Click "Sign In"
   - Use the admin credentials above
   - Navigate to: `http://localhost:5173/admin/dashboard`

## 🛠️ Create Admin User (if not exists)

Run this command from the main project directory:
```bash
npm run create-admin
```

Or manually from the API directory:
```bash
cd api
node utils/createAdmin.js
```

## 🎯 Admin Panel Features

### 📊 Dashboard
- Today's stats (bookings, revenue, shows, users)
- Real-time seat occupancy charts
- Parking occupancy analytics
- Recent bookings overview

### 👥 User Management
- View all registered users
- Filter by role (user, staff, manager, admin)
- Update user roles and status
- View user booking history
- Search users by name/email

### 🎬 Movie Management
- Add new movies
- Edit existing movies
- Delete movies (with safety checks)
- View movie statistics
- Upload movie posters
- Manage movie details (cast, genre, duration, etc.)

### 🎫 Booking Management
- View all bookings
- Filter by payment status, movie, date
- View detailed booking information
- Cancel bookings (releases seats/parking)
- Confirm pending payments
- Real-time seat and parking layout view

### 📈 Reports & Analytics
- Revenue reports (daily, weekly, monthly)
- Movie-wise performance
- Booking trends
- Export data to CSV/PDF

### 💬 Customer Support
- View contact messages
- Manage FAQ questions
- Respond to customer inquiries

## 🔒 Role-Based Access

### Admin (Full Access)
- All features available
- User role management
- Movie CRUD operations
- System settings

### Manager 
- View dashboards and reports
- Booking management
- User viewing (limited editing)
- Movie viewing

### Staff
- Basic dashboard access
- View bookings and users
- Limited administrative functions

## 🌐 URLs

- **Frontend:** `http://localhost:5173`
- **Admin Dashboard:** `http://localhost:5173/admin/dashboard`
- **API Base:** `http://localhost:5000/api`
- **Admin API:** `http://localhost:5000/api/admin`

## 🔧 Troubleshooting

### If Admin User Doesn't Exist:
1. Check MongoDB connection
2. Run the admin creation script
3. Verify `.env` file has correct MONGO connection string
4. Check console for error messages

### If Can't Access Admin Panel:
1. Ensure you're logged in with admin credentials
2. Check user role in database
3. Verify admin routes are properly configured
4. Check browser console for errors

## 📱 Mobile Responsive
The admin panel is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🎨 UI Features
- Dark theme with cinematic gold accents
- Real-time charts and graphs
- Interactive data tables
- Modal windows for detailed views
- Toast notifications for actions
- Loading states and error handling

Enjoy managing your cinema with the Cinematic Popcorn Admin Panel! 🍿
