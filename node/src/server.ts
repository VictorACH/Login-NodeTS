import express, { Application } from 'express';
import config from './config/config';
import mongoose from 'mongoose';
import indexRoutes from './routes/index';

const app: Application = express();

/**
 * Parse application/x-www-form-urlencoded and application/json
 */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/**
 * Routes
 */
app.use('/api/', indexRoutes);


/**
 * Connection to database
 */
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/victorACH', (err: unknown) => {
    if (err) throw err;
    console.log('Connected to: mongodb://localhost:27017/victorACH');
});
  
const server = app.listen(config.SERVER.port, () => console.log('Server up!, port: '+ config.SERVER.port));

export {
    app,
    server
}
