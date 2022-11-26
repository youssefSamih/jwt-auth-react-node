import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { authConfig } from '../config/auth.config';
import { db } from '../models';
import { Role } from '../models/role.model';
import { Types } from 'mongoose';

const User = db.user;

export const signup = (req: Request, res: Response) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  user.save((err, user) => {
    if (err) {
      return res.status(500).send({
        message: err
      });
    }

    if (req.body.roles) {
      return Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err: unknown, roles: ({ _id: string } & typeof Role)[]) => {
          if (err) {
            return res.status(500).send({
              message: err
            });
          }

          (user as any).roles = roles.map((role) => role._id);

          user.save((err) => {
            if (err) {
              return res.status(500).send({
                message: err
              });
            }

            return res.send({
              message: 'User was registered successfully!'
            });
          });
        }
      );
    }

    return Role.findOne(
      { name: 'user' },
      (
        err: any,
        role: {
          _id: {
            prototype?: Types.ObjectId | undefined;
            cacheHexString?: unknown;
            generate?: object;
            createFromTime?: object;
            createFromHexString?: object;
            isValid?: object;
          };
        }
      ) => {
        if (err) {
          return res.status(500).send({
            message: err
          });
        }

        user.roles = [role._id];

        user.save((err) => {
          if (err) {
            return res.status(500).send({
              message: err
            });
          }

          return res.send({
            message: 'User was registered successfully!'
          });
        });
      }
    );
  });
};

export const signin = (req: Request, res: Response) => {
  User.findOne({
    username: req.body.username
  })
    .populate('roles', '-__v')
    .exec((err, user) => {
      if (err) {
        return res.status(500).send({ message: err });
      }

      if (!user) {
        return res.status(404).send({ message: 'User not found.' });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password as string
      );

      if (!passwordIsValid) {
        return res.status(401).send({ message: 'Invalid password!' });
      }

      const token = jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: 86400 // 24 hours
      });

      const authorities: string[] = [];

      user.roles.forEach((role) => {
        authorities.push(
          `ROLE_${(role as { name: string }).name.toUpperCase()}`
        );
      });

      (req.session as { token: string }).token = token;

      return res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities
      });
    });
};

export const signout = async (req: Request, res: Response) => {
  try {
    req.session = null;

    return res.status(200).send({
      message: "You've been signed out!"
    });
  } catch (error) {
    (this as any).next(error);
  }
};
