import express from 'express';
import cors, { CorsOptions } from 'cors';
import cookieSession from 'cookie-session';

import { db } from './models';
import { dbConfig } from './config/db.config';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

const app = express();

const corsOptions: CorsOptions = {
  origin: 'http://localhost:8081'
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: 'youssef-session',
    secret: 'COOKIE_SECRET', //should use as secret environment variable
    httpOnly: true
  })
);

const Role = db.role;

function initial() {
  Role.estimatedDocumentCount((err: unknown, count: number) => {
    if (!err && count === 0) {
      new Role({
        name: 'user'
      }).save((err) => {
        if (err) {
          // eslint-disable-next-line no-console
          console.error('error', err);
        }

        // eslint-disable-next-line no-console
        console.log("added 'user' to roles collection");
      });

      new Role({
        name: 'moderator'
      }).save((err) => {
        if (err) {
          // eslint-disable-next-line no-console
          console.error('error', err);
        }

        // eslint-disable-next-line no-console
        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: 'admin'
      }).save((err) => {
        if (err) {
          // eslint-disable-next-line no-console
          console.error('error', err);
        }

        // eslint-disable-next-line no-console
        console.log("added 'admin' to roles collection");
      });
    }
  });
}

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`)
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Successfully connected to MongoDB');
    initial();
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Connection error', err);
    process.exit();
  });

// simple route
app.get('/', (req: express.Request, res: express.Response) => {
  res.json({
    message: 'Welcome to youssef application'
  });
});

authRoutes(app);

userRoutes(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Server is running on port', PORT);
});
