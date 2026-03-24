import './src/config/env.js';
import app from './src/app.js';

const PORT = process.env.PORT || 3000; // fallback to 3000 for local dev

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});