import { Router } from 'express';
import { body, param, query } from 'express-validator';
import apicache from 'apicache';
import authenticate from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import * as postsController from '../controllers/postsController.js';

const router = Router();

// Cache activo solo fuera del entorno de test
const cache =
  process.env.NODE_ENV === 'test'
    ? () => (_req, _res, next) => next()
    : (duration) => apicache.middleware(duration);

/**
 * @swagger
 * /api/v1/posts:
 *   get:
 *     summary: Obtener lista de posts paginada
 *     tags: [Posts]
 *     security: []
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
 *           enum: [createdAt, title]
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
 *         description: Lista de posts paginada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *                 meta:
 *                   $ref: '#/components/schemas/PaginationMeta'
 *             example:
 *               data:
 *                 - id: 1
 *                   title: Mi primer post
 *                   content: Contenido del post...
 *                   createdAt: '2026-03-05T10:00:00.000Z'
 *                   author:
 *                     id: 1
 *                     username: johndoe
 *               meta:
 *                 total: 1
 *                 page: 1
 *                 limit: 20
 *       422:
 *         description: Parámetros de consulta inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/',
  cache('2 minutes'),
  [
    query('page').optional().isInt({ min: 1 }).withMessage('page debe ser un entero positivo'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('limit debe estar entre 1 y 100'),
    query('sort')
      .optional()
      .isIn(['createdAt', 'title'])
      .withMessage('sort debe ser createdAt o title'),
    query('order').optional().isIn(['asc', 'desc']).withMessage('order debe ser asc o desc'),
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
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del post
 *     responses:
 *       200:
 *         description: Post encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *             example:
 *               data:
 *                 id: 1
 *                 title: Mi primer post
 *                 content: Contenido del post...
 *                 createdAt: '2026-03-05T10:00:00.000Z'
 *                 author:
 *                   id: 1
 *                   username: johndoe
 *       404:
 *         description: Post no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error:
 *                 message: Post no encontrado
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
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *           example:
 *             title: Mi primer post
 *             content: Contenido del post...
 *     responses:
 *       201:
 *         description: Post creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *             example:
 *               data:
 *                 id: 1
 *                 title: Mi primer post
 *                 content: Contenido del post...
 *                 createdAt: '2026-03-05T10:00:00.000Z'
 *                 author:
 *                   id: 1
 *                   username: johndoe
 *       401:
 *         description: Token ausente o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       422:
 *         description: Error de validación — título o contenido vacíos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error:
 *                 message: El título es obligatorio
 *                 code: VALIDATION_ERROR
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
    body('content').trim().escape().notEmpty().withMessage('El contenido es obligatorio'),
  ],
  validate,
  postsController.create,
);

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   put:
 *     summary: Actualizar completamente un post (solo el autor)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del post a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *           example:
 *             title: Título actualizado
 *             content: Contenido actualizado...
 *     responses:
 *       200:
 *         description: Post actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *       401:
 *         description: Token ausente o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: El usuario no es el autor del post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error:
 *                 message: Acceso denegado
 *                 code: FORBIDDEN
 *       404:
 *         description: Post no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       422:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
    body('content').trim().escape().notEmpty().withMessage('El contenido es obligatorio'),
  ],
  validate,
  postsController.update,
);

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   delete:
 *     summary: Eliminar un post (solo el autor)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del post a eliminar
 *     responses:
 *       204:
 *         description: Post eliminado correctamente (sin cuerpo de respuesta)
 *       401:
 *         description: Token ausente o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: El usuario no es el autor del post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Post no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(
  '/:id',
  authenticate,
  [param('id').isInt({ min: 1 }).withMessage('id debe ser un entero positivo')],
  validate,
  postsController.remove,
);

export default router;
