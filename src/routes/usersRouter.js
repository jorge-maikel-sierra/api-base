import { Router } from 'express';
import { body, param, query } from 'express-validator';
import apicache from 'apicache';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import * as usersController from '../controllers/usersController.js';

const router = Router();

// Cache activo solo fuera del entorno de test
/* istanbul ignore next */
const cache =
  process.env.NODE_ENV === 'test'
    ? () => (_req, _res, next) => next()
    : (duration) => apicache.middleware(duration);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Obtener lista de usuarios
 *     tags: [Users]
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
 *         description: Lista de usuarios
 *       401:
 *         description: No autorizado
 */
router.get(
  '/',
  authenticate,
  cache('2 minutes'),
  [
    query('page').optional().isInt({ min: 1 }).withMessage('page debe ser un entero positivo'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit debe estar entre 1 y 100'),
    query('sort')
      .optional()
      .isIn(['createdAt', 'username', 'email'])
      .withMessage('sort debe ser createdAt, username o email'),
    query('order')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('order debe ser asc o desc'),
  ],
  validate,
  usersController.getAll,
);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get(
  '/:id',
  authenticate,
  [param('id').isInt({ min: 1 }).withMessage('id debe ser un entero positivo')],
  validate,
  usersController.getById,
);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   patch:
 *     summary: Actualizar parcialmente un usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       404:
 *         description: Usuario no encontrado
 */
router.patch(
  '/:id',
  authenticate,
  [
    param('id').isInt({ min: 1 }).withMessage('id debe ser un entero positivo'),
    body('username')
      .optional()
      .trim()
      .escape()
      .isAlphanumeric()
      .withMessage('El nombre de usuario solo puede contener letras y números')
      .isLength({ min: 3, max: 30 })
      .withMessage('Debe tener entre 3 y 30 caracteres'),
    body('email')
      .optional()
      .trim()
      .isEmail()
      .withMessage('Debe ser un email válido')
      .normalizeEmail(),
  ],
  validate,
  usersController.update,
);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Usuario eliminado
 *       404:
 *         description: Usuario no encontrado
 */
router.delete(
  '/:id',
  authenticate,
  [param('id').isInt({ min: 1 }).withMessage('id debe ser un entero positivo')],
  validate,
  usersController.remove,
);

export default router;
