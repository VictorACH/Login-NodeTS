import express, { Application } from 'express';
import userRoutes from '../routes/users';
import loginRoute from '../routes/login';


const app: Application = express();

// Login
app.use(loginRoute);

// Users
app.use(userRoutes);

export = app;