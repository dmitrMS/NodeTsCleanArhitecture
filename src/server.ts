import express from 'express';
import {Express} from 'express';
import bodyParser from 'body-parser';
import { Jwt } from './jwt';
import { Database } from './database';
import { AuthHandler } from './server/handler/auth/index';
import { TrackHandler } from './server/handler/track/index';
import { TaskHandler } from './server/handler/task/index';
import { TeamHandler } from './server/handler/team/index';
import { NotificationHandler } from './server/handler/notification/index';
import { UserTeamHandler } from './server/handler/user_team/index';
import { cfg } from './config';
import { logger, logMiddleware } from './logger';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import swaggerAutogen from 'swagger-autogen';
import swaggerFile from '../swagger_output.json';
// import { Headers } from 'node-fetch';

const app:Express = express();
const db = new Database();
const jwt = new Jwt(db);
const authHandler = new AuthHandler(db, jwt);
const trackHandler = new TrackHandler(db, jwt);
const taskHandler = new TaskHandler(db, jwt);
const teamHandler = new TeamHandler(db, jwt);
const notificationHandler = new NotificationHandler(db, jwt);
const userTeamHandler = new UserTeamHandler(db, jwt);
const authHeader = 'x-auth-key';
const corsOptions = {
  origin: "http://localhost:8081",
  optionSuccessStatus: 200, 
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logMiddleware);
app.use(cors(corsOptions));
app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerFile))

app.post('/track/start', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { task_name,task_id } = req.body;
  const result = await trackHandler.start(token, task_name,task_id);

  return result !== null
    ? res.status(200).json(result)
    : res.status(200).json({ message: 'Есть незаконченная работа!' });
});

app.post('/track/stop', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const result = await trackHandler.stop(token);

  return result !== null
    ? res.status(200).json(result)
    : res.status(200).json({ message: 'Нет незаконченных работ!' });
});

app.post('/track/update', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { id_work, task_name, begin_date, end_date } = req.body;
  const result = await trackHandler.update(
    token,
    id_work,
    task_name,
    begin_date,
    end_date
  );

  return result !== null
    ? res.status(200).json(result)
    : res.status(200).json({ message: 'Нет незаконченных работ!' });
});

app.post('/track/delete', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { id_work } = req.body;
  await trackHandler.delete(token, id_work);

  return res.status(200).json({ message: 'Работа удалена' });
});

app.post('/track/status', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const verifyWork = await trackHandler.status(token);

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});

app.post('/track/list', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { team_id } = req.body;
  const verifyWork = await trackHandler.list(token,team_id);

  return res.status(200).json(verifyWork);
});

app.post('/team/track/list', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { team_id } = req.body;
  const verifyWork = await trackHandler.listTeam(token,team_id);

  return res.status(200).json(verifyWork);
});

app.post('/task/create', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { name,team_id } = req.body;
  const verifyWork = await taskHandler.create(token,name,team_id);

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});

app.post('/task/delete', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { task_id } = req.body;
  const verifyWork = await taskHandler.delete(token,task_id);

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});

app.post('/task/list', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { team_id } = req.body;
  const verifyWork = await taskHandler.list(token,team_id);

  return res.status(200).json(verifyWork);
});

app.post('/team/create', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { name } = req.body;
  const verifyWork = await teamHandler.create(token,name);

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});

app.post('/team/delete', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { team_id } = req.body;
  const verifyWork = await teamHandler.delete(token,team_id);

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});

app.post('/team/list', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const verifyWork = await teamHandler.list(token);

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});

app.post('/team/add_user', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { login,team_id } = req.body;
  const verifyWork = await teamHandler.addUserTeam(token,login,team_id);

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});

// app.post('/user_team/delete', async (req, res) => {
//   const token = req.headers[authHeader];
//   const { user_id,team_id } = req.body;
//   const verifyWork = await userTeamHandler.delete(token,user_id,team_id);

//   return verifyWork !== null
//     ? res.status(200).json(verifyWork)
//     : res.status(200).json(null);
// });

app.post('/user_team/list', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { team_id } = req.body;
  const verifyWork = await userTeamHandler.list(token,team_id);

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});

app.post('/notification/update', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { notification_id,team_id } = req.body;
  const verifyWork = await notificationHandler.updateTeam(token, notification_id, team_id);

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});

app.post('/notification/delete', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { notification_id } = req.body;
  const verifyWork = await notificationHandler.delete(token, notification_id);

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});

app.post('/notification/list', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const verifyWork = await notificationHandler.status(token);

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});

app.post('/auth/signup', async (req, res) => {
  const { login, password } = req.body;
  const token = await authHandler.singUp(login, password);

  return res.status(200).json({
    jwt: token
  });
});

app.post('/auth/signin', async (req, res) => {
  const { login, password } = req.body;
  const verifyUser = await authHandler.singIn(login, password);

  return verifyUser !== null
    ? res.status(200).json({
        jwt: verifyUser
      })
    : res.status(200).json({ message: 'Неверный логин или пароль' });
});

app.post('/auth/connect', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const verifyUser = await authHandler.connect(token);

  return verifyUser !== null
    ? res.status(200).json({
        jwt: verifyUser
      })
    : res.status(401).json();
});

app.post('/auth/data', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const verifyUser = await authHandler.getDate(token);

  return verifyUser !== null
    ? res.status(200).json({
        id: verifyUser? verifyUser.id : NaN,
        role: verifyUser ? verifyUser.role : undefined
      })
    : res.status(401).json();
});

app.listen(cfg.server.port, () => {
  logger.info(`Server is running `, {
    host: cfg.server.host,
    port: cfg.server.port
  });
});
