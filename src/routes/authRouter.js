import { Router } from 'express';
import { body } from 'express-validator';
import passport from '../config/passport.js';
import { validate } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/auth.js';
import * as authController from '../controllers/authController.js';

const router = Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       409:
 *         description: El email ya está en uso
 *       422:
 *         description: Error de validación
 */
router.post(
  '/register',
  [
    body('username')
      .trim()
      .escape()
      .isAlphanumeric()
      .withMessage('El nombre de usuario solo puede contener letras y números')
      .isLength({ min: 3, max: 30 })
      .withMessage('Debe tener entre 3 y 30 caracteres'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('Debe ser un email válido')
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 8 })
      .withMessage('La contraseña debe tener al menos 8 caracteres'),
  ],
  validate,
  authController.register,
);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Iniciar sesión y obtener un token JWT
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve access token
 *       401:
 *         description: Credenciales inválidas
 *       422:
 *         description: Error de validación
 */
router.post(
  '/login',
  [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Debe ser un email válido')
      .normalizeEmail(),
    body('password').trim().notEmpty().withMessage('La contraseña es obligatoria'),
  ],
  validate,
  passport.authenticate('local', { session: false }),
  authController.login,
);

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Renovar access token con un refresh token válido
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nuevo access token generado
 *       401:
 *         description: Refresh token inválido o expirado
 *       422:
 *         description: Error de validación
 */
router.post(
  '/refresh',
  [body('refreshToken').notEmpty().withMessage('El refresh token es obligatorio')],
  validate,
  authController.refresh,
);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Cerrar sesión (el cliente debe descartar el token)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 *       401:
 *         description: No autorizado
 */
router.post('/logout', authenticate, authController.logout);

export default router;
