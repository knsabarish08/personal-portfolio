require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./models/Project');

const seedProjects = [
  {
    title: 'AI Dashboard',
    description: 'A premium dark-mode analytics dashboard built with React and Chart.js to visualize real-time AI model performance metrics and anomaly scores.',
    link: 'https://github.com/knsabarish08/personal-portfolio',
    image: 'images/ai_dashboard.png'
  },
  {
    title: 'E-commerce Platform',
    description: 'Stunning full-stack digital storefront web application featuring secure payment gateways, dynamic cart management, and fluid responsive layouts.',
    link: 'https://github.com/knsabarish08/personal-portfolio',
    image: 'images/ecommerce.png'
  },
  {
    title: 'Weather App',
    description: 'A vibrant, modern weather tracking web app leveraging external live APIs to deliver accurate atmospheric forecasts inside sleek glassmorphic components.',
    link: 'https://github.com/knsabarish08/personal-portfolio',
    image: 'images/weather.png'
  }
];

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB for seeding');
  
  // Clear existing projects
  await Project.deleteMany({});
  console.log('Cleared existing projects');

  // Insert seed projects
  await Project.insertMany(seedProjects);
  console.log('Successfully seeded projects');

  mongoose.connection.close();
})
.catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});
