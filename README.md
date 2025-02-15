# Blood Bank Management System

## Overview
The **Blood Bank Management System** is a web application designed to efficiently manage blood donations, donors, recipients, and inventory. This system helps hospitals, blood banks, and donors streamline the process of blood donation and request handling.

## Features
- **User Authentication**: Secure login for employee.
- **Donor Management**: Track donor details, blood group, and donation history.
- **Blood Inventory**: Monitor available blood units.
- **Real-time Updates**: Ensure data accuracy with live updates on availability.
- **Search & Filtering**: Find donors or blood units quickly based on location and blood group.

## Tech Stack
- **Frontend**: ReactJS, Tailwind CSS, Toastify
- **Backend**: Supabase (PostgreSQL, Authentication, Database Management)
- **Deployment**: Netlify (Frontend), Supabase (Backend)

## Installation & Setup
### Prerequisites
- Supabase Account & API Keys

### Steps to Run Locally
1. **Clone the Repository**
   ```sh
   git clone https://github.com/yourusername/blood-bank-management.git
   cd blood-bank-management
   ```
2. **Install Dependencies**
   ```sh
   npm create vite@latest


   ReactJS
   JavaScsript
   ```
3. **Set Up Environment Variables**
   - Create a `.env` file in the root directory.
   - Add your Supabase credentials:
     ```env
     VITE_SUPABASE_ANON_KEY=your_supabase_key
     VITE_SUPABASE_URL=your_supabase_url
     ```
4. **Start the Development Server**
   ```sh
   npm run dev
   ```
5. Open `http://localhost:5173/` in your browser.

## Deployment
### Frontend (Netlify)
1. Push your code to GitHub.
2. Connect the repository to Netlify.
3. Set environment variables in Netlify settings.
4. Deploy the site.

### Backend (Supabase)
1. Go to **supabase.com** and create a new PostgreSQL database.
2. Connect your Supabase instance.
3. Deploy backend services.

## License
This project is licensed under the **MIT License**.