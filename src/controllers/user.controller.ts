import { Request, Response } from 'express';

export const allAccess = (_: Request, res: Response) => {
  return res.status(200).send('Public content.');
};

export const userBoard = (_: Request, res: Response) => {
  return res.status(200).send('User content.');
};

export const adminBoard = (_: Request, res: Response) => {
  return res.status(200).send('Admin content.');
};

export const ModeratorBoard = (_: Request, res: Response) => {
  return res.status(200).send('Moderator content.');
};
