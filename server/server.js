import express from 'express';
const app = express();
import morgan from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import 'dotenv/config';
import authJwt from './helpers/jwt.js';
import errorHandler from './helpers/errorhandler.js';

// enable cors
app.use(cors());
app.options('*', cors());

// middleware to connect frontend and backend
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);

const api = process.env.API_URL;
// routes
import loginRoutes from './routes/login.js';
import categoryRoutes from './routes/categories.js';
import productRoutes from './routes/products.js';
import userRoutes from './routes/users.js';
import cartRoutes from './routes/cart.js';
import postRoutes from './routes/posts.js';
import orderRoutes from './routes/orders.js';

app.use(`${api}`, loginRoutes);
app.use(`${api}/categories`, categoryRoutes);
app.use(`${api}/products`, productRoutes);
app.use(`${api}/users`, userRoutes);
app.use(`${api}/cart`, cartRoutes);
app.use(`${api}/posts`, postRoutes);
app.use(`${api}/orders`, orderRoutes);

// database connection
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => console.log('Database connected'))
  .catch((err) => console.log(err));

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// test server
const port = process.env.PORT || 6969;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
