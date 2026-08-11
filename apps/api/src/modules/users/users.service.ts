import { pool } from '../../database/pool';
import { NotFoundError } from '../../shared/errors';
import * as usersRepository from './users.repository';
import type { UserId } from '@meridia/shared';

export async function getPublicUser(userId: UserId) {
  const user = await usersRepository.findById(pool, userId);
  if (!user) throw new NotFoundError('User not found');
  return usersRepository.mapUserRow(user);
}
