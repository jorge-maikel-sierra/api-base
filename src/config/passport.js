import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import bcryptjs from 'bcryptjs';
import prisma from './database';

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          return done(null, false, { message: 'Credenciales inválidas' });
        }

        const isMatch = await bcryptjs.compare(password, user.password);

        if (!isMatch) {
          return done(null, false, { message: 'Credenciales inválidas' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    /* istanbul ignore next */
    async (jwtPayload, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { id: jwtPayload.sub } });

        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.serializeUser(
  /* istanbul ignore next */ (user, done) => {
    done(null, user.id);
  },
);

/* istanbul ignore next */
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
