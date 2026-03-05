import { matchedData } from 'express-validator';
import * as postsService from '../services/postsService.js';

/**
 * GET /api/v1/posts
 */
export const getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = matchedData(req, { locations: ['query'] });
    const result = await postsService.findAll({ page: Number(page), limit: Number(limit) });
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /api/v1/posts/:id
 */
export const getById = async (req, res, next) => {
  try {
    const { id } = matchedData(req, { locations: ['params'] });
    const post = await postsService.findById(Number(id));
    return res.status(200).json({ data: post });
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /api/v1/posts
 */
export const create = async (req, res, next) => {
  try {
    const data = matchedData(req, { locations: ['body'] });
    const post = await postsService.createPost(data, req.user.id);
    return res.status(201).json({ data: post });
  } catch (error) {
    return next(error);
  }
};

/**
 * PUT /api/v1/posts/:id
 */
export const update = async (req, res, next) => {
  try {
    const { id, ...data } = matchedData(req);
    const post = await postsService.updatePost(Number(id), data, req.user.id);
    return res.status(200).json({ data: post });
  } catch (error) {
    return next(error);
  }
};

/**
 * DELETE /api/v1/posts/:id
 */
export const remove = async (req, res, next) => {
  try {
    const { id } = matchedData(req, { locations: ['params'] });
    await postsService.deletePost(Number(id), req.user.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
