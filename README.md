# CourseMaster - MERN EdTech Platform

A full-stack EdTech platform built with MERN stack (MongoDB, Express, React, Node.js).

## Admin Access

To access admin features, register with email `admin@coursemaster.com` and password `admin123`, or login if already created.

## Features

### Authentication
- Student registration/login/logout with JWT
- Admin login with special role
- Protected routes
- Password hashing with bcrypt

### Public Pages
- Home page with course listing, pagination, search, sorting, filtering
- Course details page with "Enroll Now" button

### Student Features
- Student dashboard with enrolled courses and progress %
- Lesson player with YouTube/Vimeo embed
- Mark as completed to update progress
- Assignment submission (text or Google Drive link)
- Quiz submission with instant score

### Admin Features
- CRUD operations for courses (title, description, syllabus, price, tags, category)
- Add course batches
- View enrollments
- Review assignments

### Backend
- Clean folder structure: controllers, routes, models, services
- Validation with Joi
- Global error handler
- Mongoose references between User-Course-Enrollment
- Indexes for search fields

## Tech Stack

- **Frontend**: Next.js, React, Redux Toolkit, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT, bcrypt
- **Validation**: Joi

## Admin Access

To access admin features, register with email `admin@coursemaster.com` and password `admin123`, or login if already created.

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Docker (optional)
- npm or yarn

### Using Docker (Recommended)
1. Clone the repository
2. Run `docker-compose up --build`
3. Access frontend at `http://localhost:3000`
4. Backend API at `http://localhost:5000`

### Manual Setup

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   MONGO_URI=mongodb://localhost:27017/coursemaster
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the frontend directory:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:3000`

## API Documentation

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile

### Courses
- `GET /api/courses` - Get all courses (with pagination, search, filter)
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create new course (admin only)
- `PUT /api/courses/:id` - Update course (admin only)
- `DELETE /api/courses/:id` - Delete course (admin only)

### Enrollments
- `POST /api/enrollments/enroll` - Enroll in a course
- `GET /api/enrollments/my` - Get user's enrolled courses
- `PUT /api/enrollments/progress` - Update course progress

### Assignments
- `POST /api/assignments/submit` - Submit assignment
- `GET /api/assignments/lesson/:lessonId` - Get assignments for lesson
- `PUT /api/assignments/grade` - Grade assignment (admin only)

### Quizzes
- `POST /api/quizzes/submit` - Submit quiz
- `GET /api/quizzes/lesson/:lessonId` - Get quizzes for lesson
- `GET /api/quizzes/:quizId/results` - Get quiz results (admin only)

### Lessons
- `GET /api/lessons/course/:courseId` - Get lessons for course
- `POST /api/lessons` - Create lesson (admin only)
- `PUT /api/lessons/:id` - Update lesson (admin only)
- `DELETE /api/lessons/:id` - Delete lesson (admin only)

### Batches
- `GET /api/batches/course/:courseId` - Get batches for course
- `POST /api/batches` - Create batch (admin only)

## Deployment

### Frontend (Vercel)
1. Push your frontend code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Backend (Render/Heroku)
1. Push your backend code to GitHub
2. Connect to Render or Heroku
3. Set environment variables
4. Deploy

## Production Readiness

- Environment variables configured
- CORS enabled
- Password hashing implemented
- JWT authentication
- Input validation with Joi
- Error handling middleware
- Database indexes for performance
- Responsive UI with Tailwind CSS

## Future Enhancements

- Redis caching for courses API
- Analytics dashboard for admin
- Welcome email with Nodemailer
- File upload for assignments
- Payment integration
- Real-time notifications