require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const port = process.env.PORT || 5000;
connectDB(process.env.MONGODB_URI)
  .then(() => app.listen(port, () => console.log(`API on :${port}`)))
  .catch((e) => { console.error(e.message); process.exit(1); });
