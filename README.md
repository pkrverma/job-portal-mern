# Job Portal MERN Stack Application

A full-stack job portal application built with the MERN stack (MongoDB, Express.js, React, Node.js). This application allows users to browse jobs, search for opportunities, and provides an admin interface for job management.

## 🚀 Features

- **Job Browsing**: Users can view and search through available job listings
- **Responsive Design**: Built with React and Tailwind CSS for mobile-first design
- **Job Filtering**: Filter jobs by location, salary, employment type, and experience level
- **Job Creation**: Admin interface for posting new job opportunities
- **Real-time Updates**: Dynamic job data management
- **RESTful API**: Backend API built with Express.js and MongoDB

## 🛠️ Tech Stack

### Frontend (job-portal-client)
- **React** - UI library
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Hook Form** - Form handling
- **React Icons** - Icon library
- **React Select** - Enhanced select components

### Backend (job-portal-server)
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **Nodemon** - Development server auto-restart

## 📁 Project Structure

```
job-portal/
├── job-portal-client/          # React frontend application
│   ├── src/
│   │   ├── Component/          # Reusable components
│   │   ├── Pages/              # Page components
│   │   ├── Router/             # Routing configuration
│   │   ├── sidebar/            # Sidebar filtering components
│   │   └── assets/             # Static assets
│   ├── public/                 # Public assets and data files
│   └── package.json
└── job-portal-server/          # Node.js backend application
    ├── index.js                # Main server file
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pkrverma/job-portal-mern.git
   cd job-portal-mern
   ```

2. **Set up the backend**
   ```bash
   cd job-portal-server
   npm install
   ```

3. **Create environment variables**
   Create a `.env` file in the `job-portal-server` directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```

4. **Set up the frontend**
   ```bash
   cd ../job-portal-client
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd job-portal-server
   npm start
   ```
   The server will run on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd job-portal-client
   npm run dev
   ```
   The client will run on `http://localhost:5173`

## 🔧 Available Scripts

### Frontend (job-portal-client)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend (job-portal-server)
- `npm start` - Start the server with nodemon

## 🌟 Features Overview

### For Job Seekers
- Browse available job listings
- Search jobs by title, company, or keywords
- Filter jobs by:
  - Location
  - Salary range
  - Employment type (Full-time, Part-time, Contract)
  - Experience level
- View detailed job descriptions
- Responsive design for mobile and desktop

### For Employers/Admins
- Create new job postings
- Manage job listings
- Real-time job data updates

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- **Repository**: [https://github.com/pkrverma/job-portal-mern](https://github.com/pkrverma/job-portal-mern)
- **Issues**: [https://github.com/pkrverma/job-portal-mern/issues](https://github.com/pkrverma/job-portal-mern/issues)

## 👨‍💻 Author

**pkrverma**
- GitHub: [@pkrverma](https://github.com/pkrverma)

---

⭐ If you found this project helpful, please give it a star on GitHub!
