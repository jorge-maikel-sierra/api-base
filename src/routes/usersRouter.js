import { Router } from 'express';
import { body, param, query } from 'express-validator';
import apicache from 'apicache';
import authenticate from '../middlewares/auth';
import validate from '../middlewares/validate';
import * as usersController from '../controllers/usersController';

const router = Router();

// Cache activo solo fuera del entorno de test
const cache =
  process.env.NODE_ENV === 'test'
    ? () => (_req, _res, next) => next()
    : (duration) => apicache.middleware(duration);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Obtener lista de usuarios paginada
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Resultados por página (máx. 100)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [createdAt, username, email]
 *           default: createdAt
 *         description: Campo por el que ordenar
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Dirección del ordenamiento
 *     responses:
 *       200:
 *         description: Lista de usuarios paginada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 meta:
 *                   $ref: '#/components/schemas/PaginationMeta'
 *             example:
 *               data:
 *                 - id: 1
 *                   username: johndoe
 *                   email: john@example.com
 *                   createdAt: '2026-03-05T10:00:00.000Z'
 *               meta:
 *                 total: 1
 *                 page: 1
 *                 limit: 20
 *       401:
 *         description: Token ausente o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       422:
 *         description: Parámetros de consulta inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/',
  authenticate,
  cache('2 minutes'),
  [
    query('page').optional().isInt({ min: 1 }).withMessage('page debe ser un entero positivo'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('limit debe estar entre 1 y 100'),
    query('sort')
      .optional()
      .isIn(['createdAt', 'username', 'email'])
      .withMessage('sort debe ser createdAt, username o email'),
    query('order').optional().isIn(['asc', 'desc']).withMessage('order debe ser asc o desc'),
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
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *             example:
 *               data:
 *                 id: 1
 *                 username: johndoe
 *                 email: john@example.com
 *                 createdAt: '2026-03-05T10:00:00.000Z'
 *       401:
 *         description: Token ausente o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error:
 *                 message: Usuario no encontrado
 *                 code: NOT_FOUND
 *       422:
 *         description: El ID debe ser un entero positivo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserPatchInput'
 *           example:
 *             username: nuevonombre
 *             email: nuevo@example.com
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Token ausente o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       422:
 *         description: Error de validación — username o email inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error:
 *                 message: El nombre de usuario solo puede contener letras y números
 *                 code: VALIDATION_ERROR
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
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a eliminar
 *     responses:
 *       204:
 *         description: Usuario eliminado correctamente (sin cuerpo de respuesta)
 *       401:
 *         description: Token ausente o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error:
 *                 message: Usuario no encontrado
 *                 code: NOT_FOUND
 */
router.delete(
  '/:id',
  authenticate,
  [param('id').isInt({ min: 1 }).withMessage('id debe ser un entero positivo')],
  validate,
  usersController.remove,
);

export default router;
