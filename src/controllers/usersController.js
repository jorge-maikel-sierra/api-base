import { matchedData } from 'express-validator';
import * as usersService from '../services/usersService';

/**
 * GET /api/v1/users
 */
export const getAll = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      sort = 'createdAt',
      order = 'desc',
    } = matchedData(req, { locations: ['query'] });
    const result = await usersService.findAll({
      page: Number(page),
      limit: Number(limit),
      sort,
      order,
    });
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /api/v1/users/:id
 */
export const getById = async (req, res, next) => {
  try {
    const { id } = matchedData(req, { locations: ['params'] });
    const user = await usersService.findById(Number(id));
    return res.status(200).json({ data: user });
  } catch (error) {
    return next(error);
  }
};

/**
 * PATCH /api/v1/users/:id
 */
export const update = async (req, res, next) => {
  try {
    const { id, ...data } = matchedData(req);
    const user = await usersService.updateUser(Number(id), data);
    return res.status(200).json({ data: user });
  } catch (error) {
    return next(error);
  }
};

/**
 * DELETE /api/v1/users/:id
 */
export const remove = async (req, res, next) => {
  try {
    const { id } = matchedData(req, { locations: ['params'] });
    await usersService.deleteUser(Number(id));
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
