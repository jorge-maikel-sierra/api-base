import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import * as postsController from '../controllers/postsController.js';

const router = Router();

/**
 * @swagger
 * /api/v1/posts:
 *   get:
 *     summary: Obtener lista de posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Lista de posts
 */
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('page debe ser un entero positivo'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit debe estar entre 1 y 100'),
    query('sort')
      .optional()
      .isIn(['createdAt', 'title'])
      .withMessage('sort debe ser createdAt o title'),
    query('order')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('order debe ser asc o desc'),
  ],
  validate,
  postsController.getAll,
);

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   get:
 *     summary: Obtener un post por ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post encontrado
 *       404:
 *         description: Post no encontrado
 */
router.get(
  '/:id',
  [param('id').isInt({ min: 1 }).withMessage('id debe ser un entero positivo')],
  validate,
  postsController.getById,
);

/**
 * @swagger
 * /api/v1/posts:
 *   post:
 *     summary: Crear un nuevo post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post creado
 *       422:
 *         description: Error de validación
 */
router.post(
  '/',
  authenticate,
  [
    body('title')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('El título es obligatorio')
      .isLength({ max: 200 })
      .withMessage('El título no puede superar los 200 caracteres'),
    body('content')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('El contenido es obligatorio'),
  ],
  validate,
  postsController.create,
);

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   put:
 *     summary: Actualizar completamente un post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post actualizado
 *       404:
 *         description: Post no encontrado
 */
router.put(
  '/:id',
  authenticate,
  [
    param('id').isInt({ min: 1 }).withMessage('id debe ser un entero positivo'),
    body('title')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('El título es obligatorio')
      .isLength({ max: 200 })
      .withMessage('El título no puede superar los 200 caracteres'),
    body('content')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('El contenido es obligatorio'),
  ],
  validate,
  postsController.update,
);

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   delete:
 *     summary: Eliminar un post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Post eliminado
 *       404:
 *         description: Post no encontrado
 */
router.delete(
  '/:id',
  authenticate,
  [param('id').isInt({ min: 1 }).withMessage('id debe ser un entero positivo')],
  validate,
  postsController.remove,
);

export default router;
