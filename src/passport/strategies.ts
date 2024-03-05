import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '@/models/user';
import env from '@/configs/env';

/* export const local = new LocalStrategy(async (email: string, password: string, done: any) => {
  try {
    const user = await User.unscoped().findOne({ where: { email } });

    if (!user || !(await user.verifyPassword(password))) {
      return done(null, false, { message: 'invalid e-mail address or password' });
    }
    return done(null, user);
  } catch (e) {
    return done(e, false);
  }
}); */

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.sessionSecret,
};

export const customJwt = new JwtStrategy(opts, async (jwt_payload: any, done: any) => {
  console.log(jwt_payload);
  try {
    const user = await User.unscoped().findOne({ where: { id: jwt_payload.sub } });

    if (!user) {
      return done(null, false, { message: 'User not found' });
    }
    return done(null, user);
  } catch (e) {
    return done(e, false);
  }
});

/*

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  User.findOne({id: jwt_payload.sub}, function(err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
      // or you could create a new account
    }
  });
}));

*/
