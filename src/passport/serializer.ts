import User from '@/models/user';
import UserExpress = Express.User;

// eslint-disable-next-line no-unused-vars
export const serialize = (user: any, done: (err: any, id?: number | undefined) => void) => {
  done(null, user.id);
};

export const deserialize = async (
  id: number,
  done: (err: any, user?: UserExpress | false | null) => void,
) => {
  const user = await User.findByPk(id);
  done(null, user);
};
