import dotenv from 'dotenv';

dotenv.config();

// обьект для использования переменных окружения
export const cfg = {
  server: { host: 'hostname', port: process.env.SERVER_PORT || 8000 },
  jwt: {
    // время валидности токена после выдачи
    endTime: process.env.JWT_END_TIME || '1h',
    // секрет
    secret: process.env.JWT_SECRET || 'x-auth-key'
  },
  log: {
    // выбор формата вывода логов: текстовый, или json
    humanFriendly: process.env.LOG_HUMAN_FRIENDLY === 'true',
    //выбор уровня логирования
    level: process.env.LOG_LEVEL || 'info'
  }
};
