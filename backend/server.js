// 1. Import required packages
require('dotenv').config();           // Loads environment variables from a .env file into process.env
const express = require('express');   // The main web framework used to create the server
const mongoose = require('mongoose'); // A tool to interact with MongoDB databases easily
const cors = require('cors');         // Allows our frontend to make requests to our backend (Cross-Origin Resource Sharing)
const path = require('path');         // A built-in Node.js module to work with file and directory paths

// 2. Import our Database Models (Schemas)
const Project = require('./models/Project'); // Defines what a "Project" looks like in the database
const Contact = require('./models/Contact'); // Defines what a "Contact Message" looks like in the database

// 3. Initialize the Express Application
const app = express();

// --- EXPRESS SETUP & MIDDLEWARE ---
// Middleware are functions that run before our actual routes handle the request.
app.use(cors()); // Enable CORS so the browser doesn't block our frontend from talking to our backend
app.use(express.json()); // Automatically convert incoming data (like form submissions) into readable JSON

// Serve static frontend files: This tells the backend to also act as a web server for our HTML/CSS/JS files!
app.use(express.static(path.join(__dirname, '../frontend')));

// --- FALLBACK STORAGE (Beginner Friendly Feature) ---
// If you haven't set up MongoDB yet, this ensures your website still works by storing data in the computer's temporary memory.
let useMongoDB = false;
const fallbackProjects = [
  {
    title: 'AI Dashboard',
    description: 'A premium dark-mode analytics dashboard built with React and Chart.js to visualize real-time AI model performance metrics and anomaly scores.',
    link: 'https://github.com/knsabarish08/personal-portfolio',
    image: 'images/ai_dashboard.png',
    createdAt: new Date()
  },
  {
    title: 'E-commerce Platform',
    description: 'Stunning full-stack digital storefront web application featuring secure payment gateways, dynamic cart management, and fluid responsive layouts.',
    link: 'https://github.com/knsabarish08/personal-portfolio',
    image: 'images/ecommerce.png',
    createdAt: new Date()
  },
  {
    title: 'Weather App',
    description: 'A vibrant, modern weather tracking web app leveraging external live APIs to deliver accurate atmospheric forecasts inside sleek glassmorphic components.',
    link: 'https://github.com/knsabarish08/personal-portfolio',
    image: 'images/weather.png',
    createdAt: new Date()
  }
];
const fallbackContacts = [];

// --- MONGODB CONNECTION ---
console.log('Attempting to connect to MongoDB...');
// mongoose.connect() attempts to log into your MongoDB database using the URL inside your .env file
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // If it can't connect within 5 seconds, it will give up (timeout)
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully!');
  useMongoDB = true; // Tell the rest of our code to use the real database
})
.catch(err => {
  console.warn('⚠️ Failed to connect to MongoDB. Using temporary in-memory fallback storage instead.');
  useMongoDB = false; // Tell the rest of our code to use the fallback storage
});

// --- ROUTES ---
// Routes act like different "doors" to your backend. Different URLs do different things.

// 1. GET /projects: Sends all your projects to the frontend
app.get('/projects', async (req, res) => {
  try {
    if (useMongoDB) {
      // Find all projects in the database and sort them from newest to oldest
      const projects = await Project.find().sort({ createdAt: -1 });
      res.json(projects); // Send the projects back as JSON
    } else {
      res.json(fallbackProjects); // Send the fake fallback projects
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// 2. POST /projects: Allows you to add a new project to the database
app.post('/projects', async (req, res) => {
  try {
    const { title, description, link } = req.body; // Extract data sent from the request
    if (useMongoDB) {
      // Create a new project and save it to the real database
      const newProject = new Project({ title, description, link });
      await newProject.save();
      res.status(201).json(newProject);
    } else {
      // Create a fake project and add it to our temporary list
      const newProject = { title, description, link, createdAt: new Date() };
      fallbackProjects.unshift(newProject);
      res.status(201).json(newProject);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// 3. GET /contact: Admin view to see all messages people have sent you
app.get('/contact', async (req, res) => {
  try {
    if (useMongoDB) {
      // Find all contact messages in the database
      const contacts = await Contact.find().sort({ createdAt: -1 });
      res.json(contacts);
    } else {
      res.json(fallbackContacts); // Send the fallback messages
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// 4. POST /contact: Receives a new message from the frontend Contact form
app.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body; // Extract the form inputs
    
    // Check if the user forgot to fill out a field
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }
    
    if (useMongoDB) {
      // Save the message securely to the real database
      const newContact = new Contact({ name, email, message });
      await newContact.save();
    } else {
      // Save the message to our temporary list
      fallbackContacts.push({ name, email, message, createdAt: new Date() });
    }
    
    // Send a success response back to the frontend
    res.status(201).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// --- START SERVER ---
// Finally, we tell our Express app to listen for incoming requests on a specific port.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Frontend is accessible at http://localhost:${PORT}`);
});
