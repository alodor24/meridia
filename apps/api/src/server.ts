import { createApp } from './app';
import { env } from './config/env';
import { checkDatabaseConnection } from './database/pool';

const app = createApp();
const port = env.PORT;

app.listen(port, async () => {
  const dbUp = await checkDatabaseConnection();
  console.log(`Meridia API en http://localhost:${port} (db: ${dbUp ? 'conectada' : 'NO DISPONIBLE'})`);
});
