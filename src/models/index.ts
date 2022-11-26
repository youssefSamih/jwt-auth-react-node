import mongoose from 'mongoose';
import { User } from './user.model';
import { Role } from './role.model';

type DB = {
  mongoose: typeof mongoose;
  user: typeof User;
  role: typeof Role;
  ROLES: string[];
};

export const db: DB = {
  mongoose,
  user: User,
  role: Role,
  ROLES: ['user', 'admin', 'moderator']
};
