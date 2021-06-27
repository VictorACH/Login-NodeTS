import express, { Application } from 'express';
import userRoutes from '../routes/users';
import loginRoutes from '../routes/login';
import meRoutes from '../routes/me';


const app: Application = express();

// Login
app.use(loginRoutes);

// Users
app.use(userRoutes);

// Me
app.use(meRoutes);

export = app;