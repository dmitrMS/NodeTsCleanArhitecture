import express from 'express';
import { Express } from 'express';
import bodyParser from 'body-parser';
import { auth } from './routes/auth';
import { notification } from './routes/notification';
import { task } from './routes/task';
import { team } from './routes/team';
import { track } from './routes/track';
import { user_team } from './routes/user_team';
import { cfg } from './DAL/config';
import { logger, logMiddleware } from './DAL/logger';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import swaggerFile from '../swagger_output.json';

const app: Express = express();
// определение параметров для cors
const corsOptions = {
  origin: 'http://localhost:8081',
  optionSuccessStatus: 200
};

// использование парсера json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// использование логгера
app.use(logMiddleware);

// использование cors
app.use(cors(corsOptions));

// использование swagger
app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerFile));

// использование путей, которые находятся в отдельных файлах
app.use(auth);
app.use(notification);
app.use(task);
app.use(team);
app.use(track);
app.use(user_team);

// прослушивание запросов, с включённым логированием
app.listen(cfg.server.port, () => {
  logger.info(`Server is running `, {
    host: cfg.server.host,
    port: cfg.server.port
  });
});
