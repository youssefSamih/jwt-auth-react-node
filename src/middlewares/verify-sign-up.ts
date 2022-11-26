import { NextFunction, Request, Response } from 'express';
import { db } from '../models';

const User = db.user;
const ROLES = db.ROLES;

const checkDuplicateUsernameOrEmail = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  User.findOne({
    username: req.body.username
  }).exec((err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    if (user) {
      return res.status(400).send({
        message: 'Failed! Username is already in use!'
      });
    }

    User.findOne({
      email: req.body.email
    }).exec((err, user) => {
      if (err) {
        return res.status(500).send({ message: err });
      }

      if (user) {
        return res.status(400).send({
          message: 'Failed! Email is already in use!'
        });
      }

      next();
    });
  });
};

const checkRolesExisted = (req: Request, res: Response, next: NextFunction) => {
  let messageFailed;

  req.body.roles?.forEach((role: string) => {
    if (!ROLES.includes(role)) {
      messageFailed = {
        message: `Failed! Role ${role} doesn't exist!`
      };
    }
  });

  if (messageFailed) {
    return res.status(400).send(messageFailed);
  }

  next();
};

export const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};
