import type { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, VerifyCallback } from 'jsonwebtoken';

import { authConfig } from '../config/auth.config';
import { db } from '../models';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.session?.token;

  if (!token) {
    return res.status(403).send({
      message: 'Unauthorized!'
    });
  }

  jwt.verify(token, authConfig.secret, ((
    err: unknown,
    decoded: { id: string }
  ) => {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized!'
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as unknown as { userId: string }).userId = decoded.id;

    next();

    return;
  }) as VerifyCallback<JwtPayload | string>);
};

const User = db.user;
const Role = db.role;

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  User.findById((req as unknown as { userId: string }).userId).exec(
    (err, user) => {
      if (err) {
        return res.status(500).send({
          message: err
        });
      }

      Role.find(
        {
          _id: { $in: user?.roles }
        },
        (err: unknown, roles: typeof Role[]) => {
          if (err) {
            return res.status(500).send({
              message: err
            });
          }

          for (let index = 0; index < roles.length; index++) {
            const element = roles[index];

            if (element.name === 'admin') {
              return next();
            }
          }

          return res.status(403).send({
            message: 'Require Admin Role!'
          });
        }
      );
    }
  );
};

const isModerator = (req: Request, res: Response, next: NextFunction) => {
  User.findById((req as unknown as { userId: string }).userId).exec(
    (err, user) => {
      if (err) {
        return res.status(500).send({
          message: err
        });
      }

      Role.find(
        {
          _id: { $in: user?.roles }
        },
        (err: unknown, roles: typeof Role[]) => {
          if (err) {
            return res.status(500).send({
              message: err
            });
          }

          for (let index = 0; index < roles.length; index++) {
            const element = roles[index];

            if (element.name === 'moderator') {
              return next();
            }
          }

          return res.status(403).send({
            message: 'Require Moderator Role!'
          });
        }
      );
    }
  );
};

export const authJwt = {
  verifyToken,
  isAdmin,
  isModerator
};
