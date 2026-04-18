const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
const designRoutes = require('./routes/designs');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');

// ✅ Use routes
app.use('/api/designs', designRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// ✅ Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Test route
app.get('/', (req, res) => {
  res.send('🚀 RSK Tailoring Backend Running');
});

// ✅ Start server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});