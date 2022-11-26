import type { Express } from 'express';

import {
  adminBoard,
  allAccess,
  ModeratorBoard,
  userBoard
} from '../controllers/user.controller';
import { authJwt } from '../middlewares';

export default (app: Express) => {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');

    next();
  });

  app.get('/api/test/all', allAccess);

  app.get('/api/test/user', [authJwt.verifyToken], userBoard);

  app.get(
    '/api/test/mod',
    [authJwt.verifyToken, authJwt.isModerator],
    ModeratorBoard
  );

  app.get(
    '/api/test/admin',
    [authJwt.verifyToken, authJwt.isAdmin],
    adminBoard
  );
};
