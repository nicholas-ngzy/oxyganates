import express from 'express';
const app = express();
import morgan from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';
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
const __dirname = new URL('.', import.meta.url).pathname;
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));

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

// test api
app.get(`${api}`, function (req, res) {
  res.send('hello, world!');
});

// database connection
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.log(err);
  });

// test server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
