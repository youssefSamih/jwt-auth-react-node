import type { Express } from 'express';

import { signin, signout, signup } from '../controllers/auth.controller';
import { verifySignUp } from '../middlewares';

export default (app: Express) => {
  app.use((_, res, next) => {
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');

    next();
  });

  app.post(
    '/api/auth/signup',
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    signup
  );

  app.post('/api/auth/signin', signin);
  app.post('/api/auth/signout', signout);
};
