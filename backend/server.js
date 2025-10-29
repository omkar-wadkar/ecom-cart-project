import express from 'express';
import cors from 'cors';
import sequelize from './config/database.js';
import Product from './models/Product.js';
import CartItem from './models/CartItem.js';
import defineAssociations from './models/associations.js';


import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import checkoutRoutes from './routes/checkout.js';

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    defineAssociations();
    console.log('Model associations defined');

    await sequelize.sync({ force: true });
  
    await Product.bulkCreate([
      { 
        name: 'Sony WH-1000XM4 Headphones', 
        price: 349.99, 
        description: 'Industry-leading noise canceling with premium sound quality', 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe9ZZJD4xwKFiqeaZ1jgCPS56je9CwODf4ew&s' 
      },
      { 
        name: 'iPhone 17 Pro', 
        price: 999.99, 
        description: 'Latest iPhone with titanium design and advanced camera system', 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCreygsKYIJhGZFwC74VzAxSH9mdraHP-VTw&s?w=400&h=400&fit=crop' 
      },
      { 
        name: 'MacBook Pro 16"', 
        price: 2399.99, 
        description: 'Powerful laptop for professionals with M5 Pro chip', 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdZbKO05c5UKXr4H9CMo7ljPJRziro1g_NfA&s' 
      },
      { 
        name: 'Apple Watch Series 9', 
        price: 399.99, 
        description: 'Advanced smartwatch with health monitoring and fitness tracking', 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGta1z1apq3uRGGcVgQ0iLfh7SsUGDGiH4-Q&s' 
      },
      { 
        name: 'iPad Air', 
        price: 599.99, 
        description: 'Versatile tablet with M1 chip for work and creativity', 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcwZuNJ9-k_vHgBy9Ag7N1xex2IXRsiIIJSA&s' 
      }
    ]);

    console.log('Database initialized with sample data');
  } catch (error) {
    console.error('Unable to connect to database:', error);
  }
};

app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  initializeDatabase();
});