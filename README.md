# Personal Portfolio Website

A simple, beginner-friendly full-stack portfolio website built with HTML, CSS, JavaScript, Node.js, Express, and MongoDB.

## Features
- **Home**: A clean landing page introducing yourself with your name, skills, and a brief description.
- **Projects**: A dynamic page that fetches and displays your past work directly from the backend database.
- **Contact**: A functional contact form that allows visitors to send you messages, which are securely stored in the database.

## Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)

## Folder Structure
```text
portfolio-project/
├── backend/                  # Server-side code
│   ├── models/               # MongoDB Database Schemas
│   │   ├── Contact.js        # Defines how Contact messages are structured
│   │   └── Project.js        # Defines how Projects are structured
│   ├── package.json          # List of backend dependencies
│   ├── seed.js               # Optional script to insert mock data into MongoDB
│   └── server.js             # The main Express application file
│
└── frontend/                 # Client-side code (User Interface)
    ├── css/
    │   └── style.css         # All website styling and animations
    ├── js/
    │   └── main.js           # Frontend logic for fetching data and submitting forms
    ├── index.html            # The Home page
    ├── projects.html         # The Projects page
    └── contact.html          # The Contact page
```

## Setup Instructions

### 1. Install Dependencies
Open your terminal, navigate to the `backend` folder, and install the required Node.js packages:
```bash
cd backend
npm install
```

### 2. Connect to MongoDB
Create a `.env` file inside the `backend` folder and add your MongoDB connection string (e.g., from MongoDB Atlas):
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/portfolio_db?retryWrites=true&w=majority
```
*(Note: If you don't connect to MongoDB, the backend will automatically use a temporary in-memory database so your website still works!)*

### 3. Run the Backend
Start the Express server:
```bash
npm start
```
The server will start on `http://localhost:5000` and it will automatically serve your frontend files. Open `http://localhost:5000` in your web browser to view your complete website!

## API Endpoints
The backend provides the following REST API endpoints:
- `GET /projects` - Fetches all projects from the database to display on the Projects page.
- `POST /projects` - Allows you to add a new project to the database.
- `GET /contact` - Fetches all contact messages (useful for you to read your messages).
- `POST /contact` - Submits a new contact message from the frontend form to the database.

## Deployment Instructions

To put your website live on the internet, you can deploy the frontend and backend separately:

### Backend (Render)
1. Push your code to a GitHub repository.
2. Go to [Render](https://render.com/) and create a new **Web Service**.
3. Connect your GitHub repository.
4. Set the **Root Directory** to `backend`.
5. Set the **Build Command** to `npm install` and the **Start Command** to `npm start`.
6. In the Environment Variables section, add your `MONGO_URI`.
7. Click Deploy. Render will give you a live URL for your API.

### Frontend (Netlify)
1. Open `frontend/js/main.js` and change `const API_BASE_URL = 'http://localhost:5000';` to the live URL Render gave you.
2. Go to [Netlify](https://www.netlify.com/) and click "Add new site" -> "Import an existing project".
3. Connect your GitHub repository.
4. Set the **Base directory** and **Publish directory** to `frontend`.
5. Click **Deploy site**.

Your portfolio is now live for the world to see!
