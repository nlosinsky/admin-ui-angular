const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;

app.use(cors({
  origin: ['http://localhost:4300', 'http://localhost:4000'],
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

require('./routes')(app);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
