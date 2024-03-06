import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '@/models/user';
import env from '@/configs/env';

export const local = new LocalStrategy(async (email: string, password: string, done: any) => {
  try {
    const user = await User.unscoped().findOne({ where: { email } });

    if (!user || !(await user.verifyPassword(password))) {
      return done(null, false, { message: 'invalid e-mail address or password' });
    }
    return done(null, user);
  } catch (e) {
    return done(e, false);
  }
});

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.sessionSecret,
};

export const customJwt = new JwtStrategy(opts, async (jwt_payload: any, done: any) => {
  try {
    const user = await User.findByPk(jwt_payload.sub);

    if (!user) {
      return done(null, false, { message: 'User not found' });
    }
    return done(null, user);
  } catch (e) {
    return done(e, false);
  }
});