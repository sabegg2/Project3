const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');  // Import the CORS package

const app = express();
const port = 3000;

// Enable CORS for all routes
// Configures Node.js server to allow cross-origin requests by adding CORS headers.
app.use(cors());

// Configure PostgreSQL connection
const pool = new Pool({
  user: 'postgres',       // PostgreSQL username
  host: 'localhost',           // Hostname
  database: 'anemometer_db',   // Database name
  password: 'postgres',   // PostgreSQL password
  port: 5432,                  // Default PostgreSQL port
});

// Endpoint to serve data from PostgreSQL
app.get('/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM anemometer');
    res.json(result.rows); // Send query result as JSON
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching data');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
