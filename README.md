# Job_Portal
# Jobify - Job Portal Web Application

Jobify is a full-stack job portal web application built with React, Redux Toolkit, Tailwind CSS, and more. It allows job seekers to browse and apply for jobs, and recruiters to post job listings and manage applications.

## Developer

This project was designed, developed, and implemented entirely by Arjun Rajawat as a solo developer. I handled all aspects of the project including:
- Frontend architecture and component design
- State management with Redux Toolkit
- Responsive UI design with Tailwind CSS
- Authentication and authorization flows
- API integration and data management

## Features

### For Job Seekers:
- Register/Login with JWT
- Browse job listings with filters
- View detailed job descriptions
- Apply for jobs with resume upload
- Track application status
- Edit profile

### For Recruiters:
- Register/Login
- Post new job vacancies
- Edit/Delete posted jobs
- View list of applicants for each job
- Update application status

### UI Features:
- Fully responsive design using Tailwind CSS
- Light/Dark mode toggle
- Toast notifications
- Search functionality
- Skeleton loaders

## Tech Stack

### Frontend:
- React.js
- Redux Toolkit (State Management)
- React Router v6
- Tailwind CSS
- React Icons
- React Toastify

### Backend (to be implemented):
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary (for file uploads)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/jobify.git
cd jobify
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Create a `.env` file in the root directory and add the following:
```
VITE_API_URL=http://localhost:5000/api/v1
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
jobify/
├── public/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   ├── common/
│   │   ├── layout/
│   │   └── job/
│   ├── pages/
│   ├── redux/
│   │   ├── slices/
│   │   └── store.js
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .gitignore
├── package.json
├── README.md
├── tailwind.config.js
└── vite.config.js
```

## Backend Setup (Coming Soon)

The backend for this project will be implemented with Node.js, Express, and MongoDB. Instructions for setting up the backend will be provided in a future update.

## Deployment

### Frontend:
- Vercel
- Netlify
- GitHub Pages

### Backend (Coming Soon):
- Render
- Railway
- Heroku

## Personal Note

This project represents my dedication to creating a comprehensive, user-friendly job portal solution from scratch. I've focused on implementing best practices in React development, responsive design, and state management to deliver a seamless experience for both job seekers and recruiters.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [React Icons](https://react-icons.github.io/react-icons/) 