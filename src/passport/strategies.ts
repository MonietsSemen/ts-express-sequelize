import { Strategy as LocalStrategy } from 'passport-local';
import User from '@/models/user';

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
