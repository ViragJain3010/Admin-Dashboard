const express = require('express');
const cors = require('cors');
const next = require('next'); // Import Next.js
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Next.js with standalone build
const nextApp = next({ dev: false, dir: './standalone' });
const handle = nextApp.getRequestHandler();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/UserRoutes'));
app.use('/api/roles', require('./routes/RoleRoutes'));
app.use('/api/permissions', require('./routes/PermissionRoutes'));

// Serve static files from the Next.js static folder
app.use('/_next/static', express.static('./static'));

nextApp.prepare()
  .then(() => {
    console.log('Next.js prepared successfully'); // Debug log
    app.all('*', (req, res) => {
      handle(req, res);
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error during Next.js initialization:', err); // Log errors
  });

console.log('After Next.js prepare'); // Ensure this log appears
