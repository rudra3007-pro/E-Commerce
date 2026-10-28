require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/supabase');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check route for cron jobs / uptime pingers (keeps free-tier Render active)
const handleHealth = async (req, res) => {
  const checkDb = req.query.db === 'true';
  let dbStatus = db.isSupabaseConfigured() ? 'connected' : 'local';

  if (checkDb && db.isSupabaseConfigured()) {
    try {
      await db.products.count();
      dbStatus = 'active';
    } catch {
      dbStatus = 'error';
    }
  }

  res.status(200).json({
    status: 'ok',
    service: 'delulucrafts',
    uptime: `${Math.floor(process.uptime())}s`,
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
};

app.get('/health', handleHealth);
app.get('/api/health', handleHealth);
app.head('/health', (req, res) => res.status(200).end());
app.head('/api/health', (req, res) => res.status(200).end());

// Authentication redirect on root entry: unauthenticated visitors go directly to /login.html
app.get(['/', '/index.html'], (req, res, next) => {
  const cookies = req.headers.cookie || '';
  const hasToken = cookies.split(';').some(c => c.trim().startsWith('token=') && c.trim().split('=')[1]?.length > 10);
  if (!hasToken) {
    return res.redirect('/login.html');
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n========================================`);
  console.log(`⚡ DeluluCrafts running on http://0.0.0.0:${PORT}`);
  console.log(`📦 Database: ${db.isSupabaseConfigured() ? 'Supabase (Connected)' : 'Local/Supabase Hybrid (Ready for credentials)'}`);
  console.log(`========================================\n`);
});
