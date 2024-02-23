import app from '@/configs/express';
import env from '@/configs/env';

app.listen(env.port, () => {
  console.log(`Server is Fire at http://localhost:${env.port}`);
});
